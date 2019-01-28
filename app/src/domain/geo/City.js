const { attributes } = require('structure')

const City = attributes({
  id: Number,
  name: String,
  displayName: String,
  areaId: Number
})(class City {})

module.exports = City
