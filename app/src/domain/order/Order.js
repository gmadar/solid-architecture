const { attributes } = require('structure')
const DesiredProduct = require('./DesiredProduct')
const Supplier = require('../user/Supplier')

const violationCodes = {
  INVALID_CLOSED_STATE: 'INVALID_CLOSED_STATE'
}
const STATUSES = {
  pendingForJoiners: 'PENDING-FOR-JOINERS',
  choosingSupplier: 'CHOOSING-SUPPLIER',
  pendingForPayment: 'PENDING-FOR-PAYMENT',
  pendingForShipmentDetails: 'PENDING-FOR-SHIPMENT-DETAILS',
  supplierHandling: 'SUPPLIER-HANDLING',
  shipped: 'SHIPPED',
  received: 'RECEIVED',
  refunded: 'REFUNDED',
  canceled: 'CANCELED',
  leftGroup: 'LEFT-GROUP'
}

const Order = attributes({
  id: Number,
  baseOrderId: Number,
  groupId: { type: Number, required: true },
  userId: { type: Number, required: true },
  petId: Number,
  desiredProductId: Number,
  desiredProduct: DesiredProduct, // lazy loaded
  chosenProductId: Number,
  chosenSupplierId: Number,
  chosenSupplier: Supplier, // lazy loaded
  status: { type: String, equal: Object.values(STATUSES), required: true },
  quantity: { type: Number, positive: true, integer: true, default: 1 },
  singleUnitPrice: Number,
  estimatedPriceBest: Number,
  estimatedPriceWorst: Number,
  notes: { type: String, maxLength: 500, empty: true },
  cancellationReason: { type: String, empty: true },
  shipmentDate: { type: Date, empty: true },
  shipmentReceiver: { type: String, maxLength: 500, empty: true },
  shipmentPhone: { type: String, maxLength: 20, empty: true },
  shipmentAddress: { type: String, maxLength: 500, empty: true },
  shipmentCityId: Number,
  shipmentFloor: { type: String, maxLength: 45, empty: true },
  shipmentDoorCode: { type: String, maxLength: 45, empty: true },
  isLeaveShipmentNextDoor: { type: Boolean, default: false },
  paymentPaymentId: { type: String, maxLength: 45, empty: true },
  paymentIsValid: Boolean,
  paymentInvalidReason: { type: String, empty: true },
  paymentCustomerId: { type: String, maxLength: 45, empty: true },
  paymentDocumentNumber: { type: String, maxLength: 45, empty: true },
  paymentDate: { type: String, maxLength: 45, empty: true },
  paymentAmount: Number,
  paymentStatus: { type: String, maxLength: 45, empty: true },
  paymentStatusDescription: { type: String, empty: true },
  paymentLastDigits: { type: String, maxLength: 10, empty: true },
  paymentToken: { type: String, maxLength: 45, empty: true }
})(class Order {
  isLegal () {
    const violations = []
    if (
      (this.status === STATUSES.shipped || this.status === STATUSES.received) &&
      (!this.chosenSupplierId ||
        !this.chosenProductId ||
        !this.quantity ||
        !this.singleUnitPrice ||
        !this.shipmentDate)
    ) {
      violations.push({
        code: 'INVALID_CLOSED_STATE',
        reason: 'Order status cannot be changed to SHIPPED/RECEIVED without the following fields: chosenSupplierId, chosenProductId, quantity, singleUnitPrice, shipmentDate'
      })
    }
    const legal = violations.length === 0
    return { legal, violations }
  }
})

Order.statuses = STATUSES
Order.violationCodes = violationCodes

module.exports = Order
