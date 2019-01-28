const paymentServiceFactory = require('../officeguy-payment-service')

jest.mock('axios')
const axios = require('axios')
axios.post.mockImplementation(url => {
  if (url.includes('/payments/beginredirect')) {
    return { data: { 'Status': 0, 'Data': { 'RedirectURL': 'redirect-url.com' } } }
  }
  if (url.includes('/payments/get')) {
    return { data: { 'Status': 0, 'Data': { 'Payment': { id: 'payment-id', ValidPayment: true } } } }
  }
})

const config = {
  get: (key) => {
    const store = { 'payment': { companyId: 'company-id', apiKey: 'api-key' } }
    return store[key]
  }
}
const currentUser = { id: 0, contact: { name: 'John Snow', phone: '052-4587-341', email: 'know@nothing.com' } }
const logger = { info: () => {} }
const paymentService = paymentServiceFactory({ config, currentUser, logger })

test('USE-CASE officeguy-payment-service - beginRedirect: all order\'s items included in officeguy request',
  async () => {
    const items = [
      { id: 'item-id', name: 'item name', description: 'item desc', unitPrice: 100, quantity: 2 },
      { id: 'discount', name: 'discount', description: 'desc', unitPrice: -20, quantity: 1 }
    ]
    const orderId = 'order-id'
    const endRedirectUrl = 'end-url.com'
    await paymentService.beginRedirect({ orderId, items, endRedirectUrl })

    items.forEach(item => {
      expect(axios.post).toBeCalledWith(
        expect.anything(),
        expect.objectContaining(
          {
            'Items': expect.arrayContaining([
              expect.objectContaining({
                'Item': {
                  'Name': item.name,
                  'Currency': 'ILS',
                  'ExternalIdentifier': item.id,
                  'SearchMode': 'Automatic'
                },
                'UnitPrice': item.unitPrice,
                'Quantity': item.quantity,
                'Description': item.description
              })
            ])
          }
        )
      )
    })
  }
)

test('USE-CASE officeguy-payment-service - beginRedirect: order id included in officeguy request',
  async () => {
    const items = []
    const orderId = 'order-id'
    const endRedirectUrl = 'end-url.com'
    await paymentService.beginRedirect({ orderId, items, endRedirectUrl })

    expect(axios.post).toBeCalledWith(
      expect.anything(),
      expect.objectContaining(
        {
          'ExternalIdentifier': `order_id-${orderId}`
        }
      )
    )
  }
)

test('USE-CASE officeguy-payment-service - beginRedirect: credentials from config included in officeguy request',
  async () => {
    const items = []
    const orderId = 'order-id'
    const endRedirectUrl = 'end-url.com'
    await paymentService.beginRedirect({ orderId, items, endRedirectUrl })

    expect(axios.post).toBeCalledWith(
      expect.anything(),
      expect.objectContaining(
        {
          'Credentials': {
            'CompanyID': 'company-id',
            'APIKey': 'api-key'
          }
        }
      )
    )
  }
)

test('USE-CASE officeguy-payment-service - beginRedirect: customer included in officeguy request',
  async () => {
    const items = []
    const orderId = 'order-id'
    const endRedirectUrl = 'end-url.com'
    await paymentService.beginRedirect({ orderId, items, endRedirectUrl })

    expect(axios.post).toBeCalledWith(
      expect.anything(),
      expect.objectContaining(
        {
          'Customer': {
            'ExternalIdentifier': `user_id-${currentUser.id}`,
            'Name': currentUser.contact.name,
            'Phone': currentUser.contact.phone,
            'additionalProp1': { userId: currentUser.id },
            'EmailAddress': currentUser.contact.email,
            'SearchMode': 'Automatic'
          }
        }
      )
    )
  }
)

test('USE-CASE officeguy-payment-service - beginRedirect: end url included in officeguy request',
  async () => {
    const items = []
    const orderId = 'order-id'
    const endRedirectUrl = 'end-url.com'
    await paymentService.beginRedirect({ orderId, items, endRedirectUrl })

    expect(axios.post).toBeCalledWith(
      expect.anything(),
      expect.objectContaining(
        {
          'RedirectURL': endRedirectUrl
        }
      )
    )
  }
)

test('USE-CASE officeguy-payment-service - beginRedirect: redirect url is returned as response',
  async () => {
    const items = []
    const orderId = 'order-id'
    const endRedirectUrl = 'end-url.com'
    const beginRedirectUrl = await paymentService.beginRedirect({ orderId, items, endRedirectUrl })

    expect(beginRedirectUrl).toBe('redirect-url.com') // from axios mock
  }
)

test('USE-CASE officeguy-payment-service - getPayment: payment id is included in officeguy request',
    async () => {
    const paymentId = 'payment-id'
    await paymentService.getPayment(paymentId)

    expect(axios.post).toBeCalledWith(
      expect.anything(),
      expect.objectContaining(
        {
          'PaymentID': paymentId
        }
      )
    )
  }
)

test('USE-CASE officeguy-payment-service - getPayment: credentials from config included in officeguy request',
  async () => {
    const paymentId = 'payment-id'
    await paymentService.getPayment(paymentId)

    expect(axios.post).toBeCalledWith(
      expect.anything(),
      expect.objectContaining(
        {
          'Credentials': {
            'CompanyID': 'company-id',
            'APIKey': 'api-key'
          }
        }
      )
    )
  }
)

test('USE-CASE officeguy-payment-service - getPayment: payment object is returned as response',
  async () => {
    const paymentId = 'payment-id'
    const paymentResponse = await paymentService.getPayment(paymentId)

    expect(paymentResponse.id).toBe('payment-id') // from axios mock
  }
)
