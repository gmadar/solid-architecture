const createOrderFactory = require('../createOrder')

test('USE-CASE createOrder: creating valid order', async () => {
  const mockOrder = { id: 'order-id' }
  const ordersRepository = {
    create: jest.fn().mockResolvedValue(mockOrder)
  }
  const createOrder = createOrderFactory({ ordersRepository })

  const orderData = {
    groupId: 1,
    userId: 1,
    petId: 1,
    desiredProductId: 1,
    chosenProductId: 1,
    chosenSupplierId: 1,
    status: 'SHIPPED',
    shipmentDate: '2000-01-01',
    quantity: 1,
    singleUnitPrice: 1,
    paymentMethod: 'PAYPAL'
  }
  const response = await createOrder(orderData)
  expect(response).toBe(mockOrder)
})

test('USE-CASE createOrder: creating invalid order', async () => {
  const ordersRepository = {}
  const createOrder = createOrderFactory({ ordersRepository })

  const orderData = {
    status: 'non-existing-status' // invalid order data
  }
  await expect(
    createOrder(orderData)
  ).rejects.toMatchObject({ code: createOrder.codes.INVALID_INPUT })
})
