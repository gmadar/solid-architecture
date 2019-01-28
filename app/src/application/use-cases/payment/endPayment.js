const OperationalError = require('../../../utils/OperationalError')
const Order = require('../../../domain/order/Order')
const orderStatuses = Order.statuses

const codes = {
  INVALID_PAYMENT: 'INVALID_PAYMENT'
}

module.exports = ({ paymentService, updateOrder }) => {
  const res = async function endPayment ({ orderId, paymentId, customerId, documentNumber }) {
    // get payment object. verifies the paymentId is authentic and payment is valid
    let payment
    try {
      payment = await paymentService.getPayment(paymentId)
      if (payment.ValidPayment === false) {
        throw new Error(`ValidPayment field of Payment object is false. Payment: ${JSON.stringify(payment)}`)
      }
    } catch (err) {
      const invalidPaymentorderData = {
        id: orderId,
        paymentIsValid: false,
        paymentInvalidReason: err.message
      }
      await updateOrder(invalidPaymentorderData, { ignoreFieldProtection: true })
      throw new OperationalError(codes.INVALID_PAYMENT, 'invalid payment')
    }

    // update order with successful payment data
    const orderData = {
      id: orderId,
      status: orderStatuses.pendingForShipmentDetails,
      paymentPaymentId: paymentId,
      paymentCustomerId: customerId,
      paymentDocumentNumber: documentNumber,
      paymentIsValid: true,
      paymentDate: payment.Date,
      paymentAmount: payment.Amount,
      paymentStatus: payment.Status,
      paymentStatusDescription: payment.StatusDescription,
      paymentLastDigits: payment.PaymentMethod.CreditCard_LastDigits,
      paymentToken: payment.PaymentMethod.CreditCard_Token
    }
    await updateOrder(orderData, { ignoreFieldProtection: true })
  }
  res.codes = codes
  return res
}
