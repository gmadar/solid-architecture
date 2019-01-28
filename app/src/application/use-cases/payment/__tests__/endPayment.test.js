const { statuses } = require('../../../../domain/order/Order')
const endPaymentFactory = require('../endPayment')

test('USE-CASE endPayment: payment service getPayment is called with payment id', async () => {
  const updateOrder = jest.fn().mockResolvedValue()
  const paymentMock = {
    'ID': 31264937,
    'CustomerID': 31264934,
    'Date': '2019-01-19T14:41:11+02:00',
    'ValidPayment': true,
    'Status': '000',
    'StatusDescription': 'מאושר (קוד 000)',
    'Amount': 200,
    'PaymentMethod': {
      'ID': 31264936,
      'CustomerID': null,
      'CreditCard_Number': null,
      'CreditCard_LastDigits': '9103',
      'CreditCard_ExpirationMonth': 9,
      'CreditCard_ExpirationYear': 2020,
      'CreditCard_CVV': null,
      'CreditCard_Track2': null,
      'CreditCard_CitizenID': null,
      'CreditCard_CardMask': 'XXXXXXXXXXXX9103',
      'CreditCard_Token': '56f78ede-f2d9-45b8-a71b-5e93f45c1599',
      'Type': 1
    },
    'AuthNumber': null,
    'RecurringCustomerItemIDs': null
  }
  const paymentService = {
    getPayment: jest.fn().mockResolvedValue(paymentMock)
  }
  const endPayment = endPaymentFactory({ paymentService, updateOrder })

  const orderId = 'order-id'
  const paymentId = paymentMock['ID']
  const customerId = 'customer-id'
  const documentNumber = 'document-number'
  await endPayment({ orderId, paymentId, customerId, documentNumber })

  expect(paymentService.getPayment).toBeCalledWith(paymentId)
})

test('USE-CASE endPayment: order fields are updated with response from payment service + change order status', async () => {
  const updateOrder = jest.fn().mockResolvedValue()
  const paymentMock = {
    'ID': 31264937,
    'CustomerID': 31264934,
    'Date': '2019-01-19T14:41:11+02:00',
    'ValidPayment': true,
    'Status': '000',
    'StatusDescription': 'מאושר (קוד 000)',
    'Amount': 200,
    'PaymentMethod': {
      'ID': 31264936,
      'CustomerID': null,
      'CreditCard_Number': null,
      'CreditCard_LastDigits': '9103',
      'CreditCard_ExpirationMonth': 9,
      'CreditCard_ExpirationYear': 2020,
      'CreditCard_CVV': null,
      'CreditCard_Track2': null,
      'CreditCard_CitizenID': null,
      'CreditCard_CardMask': 'XXXXXXXXXXXX9103',
      'CreditCard_Token': '56f78ede-f2d9-45b8-a71b-5e93f45c1599',
      'Type': 1
    },
    'AuthNumber': null,
    'RecurringCustomerItemIDs': null
  }
  const paymentService = {
    getPayment: jest.fn().mockResolvedValue(paymentMock)
  }
  const endPayment = endPaymentFactory({ paymentService, updateOrder })

  const orderId = 'order-id'
  const paymentId = paymentMock['ID']
  const customerId = 'customer-id'
  const documentNumber = 'document-number'
  await endPayment({ orderId, paymentId, customerId, documentNumber })

  expect(updateOrder).toBeCalledWith({
    id: orderId,
    status: statuses.pendingForShipmentDetails,
    paymentPaymentId: paymentId,
    paymentCustomerId: customerId,
    paymentDocumentNumber: documentNumber,
    paymentIsValid: true,
    paymentDate: paymentMock.Date,
    paymentAmount: paymentMock.Amount,
    paymentStatus: paymentMock.Status,
    paymentStatusDescription: paymentMock.StatusDescription,
    paymentLastDigits: paymentMock.PaymentMethod.CreditCard_LastDigits,
    paymentToken: paymentMock.PaymentMethod.CreditCard_Token
  }, expect.anything())
})

test('USE-CASE endPayment: invalid payment throws error', async () => {
  const updateOrder = jest.fn().mockResolvedValue()
  const paymentMock = {
    'ID': 'payment-id',
    'ValidPayment': false
  }
  const paymentService = {
    getPayment: jest.fn().mockResolvedValue(paymentMock)
  }
  const endPayment = endPaymentFactory({ paymentService, updateOrder })

  const orderId = 'order-id'
  const paymentId = paymentMock['ID']
  const customerId = 'customer-id'
  const documentNumber = 'document-number'
  await expect(
    endPayment({ orderId, paymentId, customerId, documentNumber })
  ).rejects.toThrow('invalid payment')
})

test('USE-CASE endPayment: invalid payment updates order with failure details', async () => {
  const updateOrder = jest.fn().mockResolvedValue()
  const paymentMock = {
    'ID': 'payment-id',
    'ValidPayment': false
  }
  const paymentService = {
    getPayment: jest.fn().mockResolvedValue(paymentMock)
  }
  const endPayment = endPaymentFactory({ paymentService, updateOrder })

  const orderId = 'order-id'
  const paymentId = paymentMock['ID']
  const customerId = 'customer-id'
  const documentNumber = 'document-number'
  try {
    await endPayment({ orderId, paymentId, customerId, documentNumber })
  } catch (err) {
  }

  expect(updateOrder).toBeCalledWith({
    id: orderId,
    paymentIsValid: false,
    paymentInvalidReason: expect.stringContaining('ValidPayment field of Payment object is false')
  }, expect.anything())
})
