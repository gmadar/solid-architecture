const DesiredProductMapper = require('../../mappers/DesiredProductMapper')

class SequelizeDesiredProductsRepository {
  constructor ({ database, currentUser }) {
    this.currentUser = currentUser
    this.DesiredProductModel = database.DesiredProduct
    this.PropertyValueModel = database.PropertyValue
    this.GroupModel = database.Group
  }

  async getAll ({ includeGroup = true, includeProperties = true, onlyOpenGroups = false } = {}) {
    if (!this.currentUser) { throw new Error('missing current user') } // TODO: throw operational error
    const where = { userId: this.currentUser.id }

    const include = []
    if (includeProperties) {
      include.push({ model: this.PropertyValueModel, include: [{ all: true, nested: true }] })
    }
    if (includeGroup) {
      include.push({
        model: this.GroupModel,
        attributes: ['groupId'],
        where: onlyOpenGroups ? { status: 'OPEN' } : undefined
      })
    }

    const desiredProducts = await this.DesiredProductModel.findAll({ where, include })
    return desiredProducts.map(DesiredProductMapper.toDomain)
  }

  async getById (desiredProductId) {
    if (!this.currentUser) { throw new Error('missing current user') } // TODO: throw operational error
    const where = { userId: this.currentUser.id }

    const include = [
      { model: this.PropertyValueModel, include: [{ all: true, nested: true }] }
    ]
    const desiredProduct = await this.DesiredProductModel.findByPk(desiredProductId, { include, where })
    if (!desiredProduct) return null

    return DesiredProductMapper.toDomain(desiredProduct)
  }

  async getLast () {
    if (!this.currentUser) { throw new Error('missing current user') } // TODO: throw operational error
    const where = { userId: this.currentUser.id }

    const sort = [['createdAt', 'DESC'], ['desiredProductId', 'DESC']]

    const lastDesiredProduct = await this.DesiredProductModel.findOne({ where, order: sort })
    if (!lastDesiredProduct) return null

    return DesiredProductMapper.toDomain(lastDesiredProduct)
  }

  async create (desiredProduct) {
    const desiredProductAsDb = DesiredProductMapper.toDatabase(desiredProduct)

    const include = []
    if (desiredProductAsDb.PropertyValues && desiredProductAsDb.PropertyValues.length) {
      include.push({ model: this.PropertyValueModel, include: [{ all: true, nested: true }] })
    }

    const createdDesiredProduct = await this.DesiredProductModel.create(desiredProductAsDb, { include })

    // returned object from 'create' doesn't contain all nested associations, so need to re-fetch
    const createdDesiredProductWithNested = await createdDesiredProduct.reload()

    return DesiredProductMapper.toDomain(createdDesiredProductWithNested)
  }

  async deleteById (desiredProductId) {
    if (!this.currentUser) { throw new Error('missing current user') } // TODO: throw operational error
    const where = { userId: this.currentUser.id }

    const include = [this.PropertyValueModel]
    const desiredProductInstance = await this.DesiredProductModel.findByPk(desiredProductId, { include, where })

    if (!desiredProductInstance) {
      throw new Error(`could not find desired product with id "${desiredProductId}"`) // TODO: throw operational error
    }

    await desiredProductInstance.destroy()
    await Promise.all(
      desiredProductInstance.PropertyValues.map(currPropertyValue => currPropertyValue.destroy())
    )
  }

  async update (desiredProduct) {
    if (!this.currentUser) { throw new Error('missing current user') } // TODO: throw operational error
    const where = { userId: this.currentUser.id }

    const desiredProductAsDb = DesiredProductMapper.toDatabase(desiredProduct)

    const include = [this.PropertyValueModel]
    const desiredProductInstance = await this.DesiredProductModel.findByPk(desiredProduct.id, { include, where })
    if (!desiredProductInstance) {
      throw new Error(`could not find desired product with id "${desiredProduct.id}"`) // TODO: throw operational error
    }

    // we treat product properties as immutable value objects. upon update, we remove and add new ones
    for (let currPropertyValue of desiredProductInstance.PropertyValues) {
      await currPropertyValue.destroy()
    }
    const newPropertyValuesInstances = await Promise.all(
      desiredProductAsDb.PropertyValues.map(
        propertyValueAttributes => this.PropertyValueModel.create(propertyValueAttributes)
      )
    )

    // update the root desired product
    await desiredProductInstance.update(desiredProductAsDb)
    await desiredProductInstance.setPropertyValues(newPropertyValuesInstances)
  }
}

module.exports = SequelizeDesiredProductsRepository
