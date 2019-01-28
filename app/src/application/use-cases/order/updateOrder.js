const Order = require('../../../domain/order/Order')
const { roles } = require('../../../domain/user/User')
const OperationalError = require('../../../utils/OperationalError')

const orderStatuses = Order.statuses
const codes = {
  INVALID_INPUT: 'INVALID_INPUT',
  ORDER_NOT_EXISTS: 'ORDER_NOT_EXISTS',
  ILLEGAL_STATE: 'ILLEGAL_STATE',
  UNAUTHORIZED: 'UNAUTHORIZED'
}

const CONSUMER_ALLOWED_FIELDS = [
  'status', // TODO: remove after extracting separated use-case for leaving group
  'notes',
  'quantity'
]

module.exports = ({ ordersRepository, setPetExistingProduct, currentUser }) => {
  const res = async function updateOrder (orderData, { ignoreFieldProtection = false } = {}) {
    if (!orderData.id) {
      const errors = ['id field is required']
      throw new OperationalError(codes.INVALID_INPUT, 'invalid order data provided', errors)
    }

    const isAdmin = (currentUser.role === roles.admin)
    const currentOrder = await ordersRepository.getById(orderData.id, { currentUserOnly: !isAdmin })
    if (!currentOrder) {
      throw new OperationalError(codes.ORDER_NOT_EXISTS, `order with id "${orderData.id}" not exists`)
    }

    // If order is updated by regular user (not admin), he is allowed to update only certain fields
    if (!ignoreFieldProtection && !isAdmin) {
      if (Object.keys(orderData).some(field => field !== 'id' && !CONSUMER_ALLOWED_FIELDS.includes(field))) {
        throw new OperationalError(codes.UNAUTHORIZED,
          `user "${currentUser.id}" is unauthorized to update those order fields`)
      }

      // TODO: extract separated use-case
      // regular user is allowed to change only 'leftGroup' status
      if (orderData.status && orderData.status !== orderStatuses.leftGroup) {
        throw new OperationalError(codes.UNAUTHORIZED,
          `user "${currentUser.id}" is unauthorized to update status field`)
      }
    }

    const mergedOrderData = { ...currentOrder.toJSON(), ...orderData }
    const order = new Order(mergedOrderData)

    const { valid, errors } = order.validate()
    if (!valid) {
      throw new OperationalError(codes.INVALID_INPUT, 'invalid order data provided', errors)
    }

    const { legal, violations } = order.isLegal()
    if (!legal) {
      throw new OperationalError(codes.ILLEGAL_STATE, 'illegal order state', violations)
    }

    await ordersRepository.update(order)

    // TODO: use global event to notify order was closed and react upon, instead of having direct coupling
    if (order.petId && (orderData.status === orderStatuses.shipped || orderData.status === orderStatuses.received)) {
      await setPetExistingProduct(order.petId, order.chosenProductId)
    }
  }
  res.codes = codes
  return res
}
