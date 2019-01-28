const { attributes } = require('structure')

const Property = require('../product/Property')

const Pet = attributes({
  id: Number,
  animal: { type: String, equal: ['DOG', 'CAT'], required: true },
  name: { type: String, maxLength: 20 },
  birthday: { type: String, empty: true },
  photo: { type: String, empty: true },
  raceId: { type: Number, required: true },
  ownerUserId: { type: Number, required: true },
  properties: { type: Array, itemType: Property, required: true },
  createdAt: Date
})(class Pet {})

module.exports = Pet
