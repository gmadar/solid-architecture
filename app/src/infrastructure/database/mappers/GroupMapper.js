const Group = require('../../../domain/group/Group')

const GroupMapper = {
  toDomain (dbDataValues) {
    const { groupId, Orders, Areas, Cities, ...otherFields } = dbDataValues.toJSON()

    return new Group({
      id: groupId,
      orderIds: Orders ? Orders.map(p => p.orderId) : undefined,
      areaIds: Areas ? Areas.map(p => p.areaId) : undefined,
      cityIds: Cities ? Cities.map(p => p.cityId) : undefined,
      ...otherFields
    })
  },

  toDatabase (domainDataValues) {
    const { id, cityIds, areaIds, orderIds, ...otherFields } = domainDataValues.toJSON ? domainDataValues.toJSON() : domainDataValues

    return {
      Orders: orderIds,
      groupId: id,
      ...otherFields
    }
  }
}

module.exports = GroupMapper
