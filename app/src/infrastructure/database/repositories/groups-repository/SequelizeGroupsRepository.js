const GroupMapper = require('../../mappers/GroupMapper')

class SequelizeGroupsRepository {
  constructor ({ database, currentUser }) {
    this.currentUser = currentUser
    this.GroupModel = database.Group
    this.AreaModel = database.Area
    this.CityModel = database.City
    this.OrderModel = database.Order
  }

  async getAll ({ includeOrders = true, includeGeo = true } = {}) {
    const include = []
    if (includeGeo) {
      include.push(this.AreaModel)
      include.push(this.CityModel)
    }
    if (includeOrders) {
      include.push(this.OrderModel)
    }

    const groups = await this.GroupModel.findAll({ include })
    return groups.map(GroupMapper.toDomain)
  }

  async getById (groupId, { includeOrders = true, includeGeo = true } = {}) {
    const include = []
    if (includeGeo) {
      include.push(this.AreaModel)
      include.push(this.CityModel)
    }
    if (includeOrders) {
      include.push(this.OrderModel)
    }

    const group = await this.GroupModel.findByPk(groupId, { include })
    if (!group) return null

    return GroupMapper.toDomain(group)
  }

  async getLastJoined ({ includeGeo = true } = {}) {
    if (!this.currentUser) { throw new Error('missing current user') } // TODO: throw operational error

    // when querying last group joined to, it must be by order- so we include it anyway
    const include = [
      {
        model: this.OrderModel,
        where: { 'userId': this.currentUser.id }
      }]
    if (includeGeo) {
      include.push(this.AreaModel)
      include.push(this.CityModel)
    }
    const sort = [['createdAt', 'DESC'], ['groupId', 'DESC']]

    const group = await this.GroupModel.findOne({ include, order: sort })
    if (!group) return null

    return GroupMapper.toDomain(group)
  }

  async update (group) {
    const groupAsDb = GroupMapper.toDatabase(group)

    const groupInstance = await this.GroupModel.findByPk(group.id)
    const updatedGroup = await groupInstance.update(groupAsDb)
    return updatedGroup
  }

  async create (group) {
    const groupAsDb = GroupMapper.toDatabase(group)
    const createdGroup = await this.GroupModel.create(groupAsDb)

    // solution for creating with belongsToMany field with ids of existing records and not creating the nested records
    const reloadInclude = [this.OrderModel]
    if (group.areaIds && group.areaIds.length) {
      await createdGroup.setAreas(group.areaIds)
      reloadInclude.push(this.AreaModel)
    }
    if (group.cityIds && group.cityIds.length) {
      await createdGroup.setCities(group.cityIds)
      reloadInclude.push(this.CityModel)
    }
    if (reloadInclude.length) {
      await createdGroup.reload({ include: reloadInclude })
    }

    return GroupMapper.toDomain(createdGroup)
  }

  async deleteById (groupId) {
    const groupInstance = await this.GroupModel.findByPk(groupId)
    // TODO: throw operational error
    if (!groupInstance) {
      throw new Error(`could not find group with id "${groupId}"`)
    }
    groupInstance.destroy()
  }
}

module.exports = SequelizeGroupsRepository
