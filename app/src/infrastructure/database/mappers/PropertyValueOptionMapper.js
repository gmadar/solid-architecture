const PropertyValueOption = require('../../../domain/product/PropertyValueOption')

const PropertyValueOptionMapper = {
  toDomain (dbDataValues) {
    const { ...otherFields } = dbDataValues.toJSON ? dbDataValues.toJSON() : dbDataValues

    return new PropertyValueOption({
      ...otherFields
    })
  },

  toDatabase (domainDataValues) {
    const { ...otherFields } = domainDataValues.toJSON()

    return {
      ...otherFields
    }
  }
}

module.exports = PropertyValueOptionMapper
