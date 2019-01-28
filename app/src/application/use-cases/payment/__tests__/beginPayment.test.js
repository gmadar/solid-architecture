const beginPaymentFactory = require('../beginPayment')

const mockProduct = {
  id: 'product-id',
  nameHeb: 'product name',
  properties: [{ propertyTypeId: 'SACK_SIZE', value: 10 }]
}
const getProductById = jest.fn().mockResolvedValue(mockProduct)

const mockOrder = {
  id: 'order-id',
  quantity: 2,
  singleUnitPrice: 100,
  chosenProductId: mockProduct.id
}
const getOrderById = jest.fn().mockResolvedValue(mockOrder)

const paymentService = {
  beginRedirect: jest.fn().mockResolvedValue()
}
const beginPayment = beginPaymentFactory({ paymentService, getProductById, getOrderById })

test('USE-CASE beginPayment: order id is passed as argument', async () => {
  const orderId = mockOrder.id
  const endRedirectUrl = 'end-redirect-url.com'
  await beginPayment(orderId, endRedirectUrl)
  expect(paymentService.beginRedirect).toBeCalledWith(
    expect.objectContaining({ orderId })
  )
})

test('USE-CASE beginPayment: end redirect url is passed as argument', async () => {
  const orderId = mockOrder.id
  const endRedirectUrl = 'end-redirect-url.com'
  await beginPayment(orderId, endRedirectUrl)
  expect(paymentService.beginRedirect).toBeCalledWith(
    expect.objectContaining({ endRedirectUrl })
  )
})

test('USE-CASE beginPayment: order\'s chosen product included in items', async () => {
  const orderId = mockOrder.id
  const endRedirectUrl = 'end-redirect-url.com'
  await beginPayment(orderId, endRedirectUrl)
  expect(paymentService.beginRedirect).toBeCalledWith(
    expect.objectContaining({
      items: expect.arrayContaining([
        {
          id: `product_id-${mockProduct.id}`,
          name: mockProduct.nameHeb,
          description: `${mockProduct.properties[0].value} ק"ג`,
          unitPrice: mockOrder.singleUnitPrice,
          quantity: mockOrder.quantity
        }
      ])
    })
  )
})

test('USE-CASE beginPayment: discount included in items', async () => {
  const discount = 20 // TODO: update after coupons implementation
  const orderId = mockOrder.id
  const endRedirectUrl = 'end-redirect-url.com'
  await beginPayment(orderId, endRedirectUrl)
  expect(paymentService.beginRedirect).toBeCalledWith(
    expect.objectContaining({
      items: expect.arrayContaining([
        {
          id: 'discount',
          name: 'הנחה',
          description: `${discount} ש"ח`,
          unitPrice: discount * -1,
          quantity: 1
        }
      ])
    })
  )
})
