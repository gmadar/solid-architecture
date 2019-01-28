const PetMapper = require('../../mappers/PetMapper')
const PetRaceMapper = require('../../mappers/PetRaceMapper')

class SequelizePetsRepository {
  constructor ({ database, currentUser }) {
    this.currentUser = currentUser
    this.PetModel = database.Pet
    this.PetRaceModel = database.PetRace
    this.PropertyValueModel = database.PropertyValue
  }

  async getAll ({ includeProperties = true } = {}) {
    // TODO: throw operational error
    if (!this.currentUser) { throw new Error('missing current user') }

    const include = []
    if (includeProperties) {
      include.push({ model: this.PropertyValueModel, include: [{ all: true, nested: true }] })
    }
    const where = {
      ownerUserId: this.currentUser.id
    }

    const pets = await this.PetModel.findAll({ where, include })
    return pets.map(PetMapper.toDomain)
  }

  async getById (petId, { includeProperties = true } = {}) {
    // TODO: throw operational error
    if (!this.currentUser) { throw new Error('missing current user') }

    const include = []
    if (includeProperties) {
      include.push({ model: this.PropertyValueModel, include: [{ all: true, nested: true }] })
    }
    const where = { petId, ownerUserId: this.currentUser.id }
    const pet = await this.PetModel.findOne({ where, include })
    if (!pet) return null

    return PetMapper.toDomain(pet)
  }

  async create (pet) {
    const petAsDb = PetMapper.toDatabase(pet)

    const include = []
    if (pet.properties && pet.properties.length) {
      include.push({ model: this.PropertyValueModel, include: [{ all: true, nested: true }] })
    }

    let createdPet = await this.PetModel.create(petAsDb, { include })

    // returned object from 'create' doesn't contain all nested associations, so need to re-fetch
    if (pet.properties && pet.properties.length) {
      createdPet = await createdPet.reload()
      return PetMapper.toDomain(createdPet)
    } else {
      // manually simulate empty array (db returns without it if excluded)
      const asDomain = PetMapper.toDomain(createdPet)
      asDomain.properties = []
      return asDomain
    }
  }

  async deleteById (petId) {
    const include = [this.PropertyValueModel]
    const where = { userId: this.currentUser.id }
    const petInstance = await this.PetModel.findByPk(petId, { include, where })

    if (!petInstance) {
      throw new Error(`could not find a pet with id "${petId}"`) // TODO: throw operational error
    }

    await petInstance.destroy()
    await Promise.all(
      petInstance.PropertyValues.map(currPropertyValue => currPropertyValue.destroy())
    )
  }

  async update (pet, { preserveExistingProperties = false }) {
    const petAsDb = PetMapper.toDatabase(pet)

    const include = [this.PropertyValueModel]
    const where = { userId: this.currentUser.id }
    const petInstance = await this.PetModel.findByPk(pet.id, { include, where })
    if (!petInstance) {
      throw new Error(`could not find a pet with id "${pet.id}"`) // TODO: throw operational error
    }

    // we treat pet properties as immutable value objects. upon update, we remove and add new ones
    const newPropertyValuesInstances = []
    for (let currPropertyValue of petInstance.PropertyValues) {
      // if flag to preserve existing properties is set, destroy only properties we going to re-create
      if (!preserveExistingProperties ||
        (pet.properties &&
          pet.properties.some(({ propertyTypeId }) => propertyTypeId === currPropertyValue.propertyTypeId))) {
        await currPropertyValue.destroy()
      } else {
        newPropertyValuesInstances.push(currPropertyValue)
      }
    }

    // create new property value instances
    const createdValuesInstances = await Promise.all(
      petAsDb.PropertyValues.map(
        propertyValueAttributes => this.PropertyValueModel.create(propertyValueAttributes)
      )
    )
    newPropertyValuesInstances.push(...createdValuesInstances)

    // update the root pet
    await petInstance.update(petAsDb)
    await petInstance.setPropertyValues(newPropertyValuesInstances)
  }

  async getAllRaces ({ animal } = {}) {
    const where = animal ? { animal } : undefined
    const pets = await this.PetRaceModel.findAll({ where })
    return pets.map(PetRaceMapper.toDomain)
  }
}

module.exports = SequelizePetsRepository
