const Order = require('../Order')

test('DOMAIN Order: isLegal - received/shipped status must have specific fields', async () => {
  const orderData = {
    id: 1,
    groupId: 1,
    userId: 1,
    petId: 1,
    status: 'SHIPPED'
  }
  const order = new Order(orderData)

  const { legal, violations } = order.isLegal()
  expect(legal).toBe(false)
  expect(violations[0].code).toBe('INVALID_CLOSED_STATE')
})

test('DOMAIN Order: isLegal - returns true if received/shipped status have required fields', async () => {
  const orderData = {
    id: 1,
    groupId: 1,
    userId: 1,
    petId: 1,
    status: 'SHIPPED',
    chosenProductId: 1,
    chosenSupplierId: 1,
    quantity: 2,
    singleUnitPrice: 100,
    shipmentDate: '2010-01-01'
  }
  const order = new Order(orderData)

  const { legal, violations } = order.isLegal()
  expect(legal).toBe(true)
  expect(violations.length).toBe(0)
})
