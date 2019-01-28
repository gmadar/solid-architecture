const { attributes } = require('structure')

const Property = attributes({
  propertyTypeId: { type: String, required: true },
  value: { type: String, required: true },
  valuesRelation: {
    type: String,
    equal: ['SINGLE', 'MULTIPLE-AND', 'MULTIPLE-OR', 'RANGE-FROM', 'RANGE-TO']
  },
  unit: {
    type: String,
    equal: ['KG', 'YEAR', 'LITTER']
  },
  dataType: {
    type: String,
    equal: ['NUMBER', 'BOOLEAN', 'STRING']
  },
  metadata: Object
})(class Property {
  /**
   * gets the value as primitive according to the dataType field
   */
  getValue () {
    switch (this.dataType) {
      case 'NUMBER':
        return parseFloat(this.value)
      case 'BOOLEAN':
        return (this.value.toUpperCase() === 'TRUE')
      default:
        return this.value
    }
  }
})

module.exports = Property
