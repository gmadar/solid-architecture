const Area = require('../../../domain/geo/Area')

const AreaMapper = {
  toDomain (dbDataValues) {
    const { areaId, areaName, ...otherFields } = dbDataValues.toJSON ? dbDataValues.toJSON() : dbDataValues

    return new Area({
      id: areaId,
      name: areaName,
      ...otherFields
    })
  },

  toDatabase (domainDataValues) {
    const { id, name, ...otherFields } = domainDataValues.toJSON()

    return {
      areaId: id,
      areaName: name,
      name,
      ...otherFields
    }
  }
}

module.exports = AreaMapper
