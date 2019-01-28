const { attributes } = require('structure')

const City = require('../geo/City')

const Contact = attributes({
  id: Number,
  email: { type: String, email: true, required: true },
  name: { type: String, required: true },
  city: City,
  phone: { type: String, empty: true },
  phone2: { type: String, empty: true },
  fax: { type: String, empty: true },
  address: { type: String, empty: true },
  doorCode: { type: String, empty: true },
  floor: { type: String, empty: true },
  isLeaveShipmentNextDoor: { type: Boolean, default: false },
  isAgreedToCommercial: { type: Boolean, default: false }
})(class Contact {})

module.exports = Contact
