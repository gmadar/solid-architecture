/**
 * translates client side format to domain format
 */
const GroupMapper = {
  fromClient (clientDataValues) {
    const response = {
      ...clientDataValues
    }
    return response
  },

  toClient (domainDataValues) {
    return {
      id: domainDataValues.id,
      name: domainDataValues.name,
      endDate: domainDataValues.endDate,
      status: domainDataValues.status,
      areaIds: domainDataValues.areaIds,
      cityIds: domainDataValues.cityIds,
      description: domainDataValues.description,
      totalOrders: domainDataValues.getTotalOrders()
    }
  }
}

module.exports = GroupMapper
