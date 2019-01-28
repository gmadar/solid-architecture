const { attributes } = require('structure')

const PropertyValueOption = attributes({
  propertyTypeId: { type: String, required: true },
  valueOptionId: { type: String, required: true },
  labelEng: { type: String, required: true },
  labelHeb: { type: String, required: true }
})(class PropertyValueOption {
})

module.exports = PropertyValueOption
