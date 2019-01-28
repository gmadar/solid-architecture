const { attributes } = require('structure')

const Area = attributes({
  id: Number,
  name: String
})(class Area {})

module.exports = Area
