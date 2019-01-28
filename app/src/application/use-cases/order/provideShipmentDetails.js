const _ = require('lodash')

const Order = require('../../../domain/order/Order')
const OperationalError = require('../../../utils/OperationalError')

const orderStatuses = Order.statuses
const codes = {
  INVALID_INPUT: 'INVALID_INPUT',
  ORDER_NOT_EXISTS: 'ORDER_NOT_EXISTS',
  ILLEGAL_STATE: 'ILLEGAL_STATE',
  UNAUTHORIZED: 'UNAUTHORIZED'
}

const REQUIRED_SHIPMENT_FIELDS = [
  'shipmentReceiver',
  'shipmentPhone',
  'shipmentAddress',
  'shipmentCityId'
]

const ALLOWED_FIELDS = [
  'shipmentFloor',
  'shipmentDoorCode',
  'isLeaveShipmentNextDoor',
  ...REQUIRED_SHIPMENT_FIELDS
]

// TODO: tests
module.exports = ({ ordersRepository, updateOrder }) => {
  const res = async function provideOrderShipmentDetails (orderId, shipmentData) {
    if (Object.keys(shipmentData).some(field => !ALLOWED_FIELDS.includes(field))) {
      throw new OperationalError(codes.INVALID_INPUT, `received invalid input fields`)
    }

    const currentOrder = await ordersRepository.getById(orderId)
    if (!currentOrder) {
      throw new OperationalError(codes.ORDER_NOT_EXISTS, `order with id "${orderId}" not exists`)
    }

    // allow to update shipment details only if order is in 'pending-for-details' status
    if (currentOrder.status !== orderStatuses.pendingForShipmentDetails) {
      throw new OperationalError(codes.ILLEGAL_STATE,
        `shipment details can be provided only in 'pending for shipment details' status`)
    }

    // verify all required shipment details are provided
    if (REQUIRED_SHIPMENT_FIELDS.some(field => !_.has(shipmentData, field))
    ) {
      throw new OperationalError(codes.ILLEGAL_STATE,
        `all shipment fields ${REQUIRED_SHIPMENT_FIELDS.join(', ')} are required`)
    }

    const newOrderData = {
      id: orderId,
      status: orderStatuses.supplierHandling, // advance order to next status
      ...shipmentData
    }
    await updateOrder(newOrderData, { ignoreFieldProtection: true })
  }
  res.codes = codes
  return res
}
