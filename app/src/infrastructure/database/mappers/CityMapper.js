/* eslint camelcase: 0 */
const City = require('../../../domain/geo/City')

const CityMapper = {
  toDomain (dbDataValues) {
    const { cityId, cityName, area_id, ...otherFields } = dbDataValues.toJSON ? dbDataValues.toJSON() : dbDataValues

    return new City({
      id: cityId,
      name: cityName,
      areaId: area_id,
      ...otherFields
    })
  },

  toDatabase (domainDataValues) {
    const { id, name, areaId, ...otherFields } = domainDataValues.toJSON()

    return {
      cityId: id,
      cityName: name,
      area_id: areaId,
      ...otherFields
    }
  }
}

module.exports = CityMapper
