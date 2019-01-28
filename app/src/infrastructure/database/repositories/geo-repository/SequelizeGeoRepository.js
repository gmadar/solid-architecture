const CityMapper = require('../../mappers/CityMapper')
const AreaMapper = require('../../mappers/AreaMapper')

class SequelizeGeoRepository {
  constructor ({ database }) {
    this.CityModel = database.City
    this.AreaModel = database.Area
  }

  async getAllCities () {
    const allCities = await this.CityModel.findAll()
    return allCities.map(CityMapper.toDomain)
  }

  async getAllAreas () {
    const allAreas = await this.AreaModel.findAll()
    return allAreas.map(AreaMapper.toDomain)
  }
}

module.exports = SequelizeGeoRepository
