const getLastOrderFactory = require('../getLastOrder')

test('USE-CASE getLastOrder: no orders exists', async () => {
  const ordersRepository = {
    getLast: jest.fn().mockResolvedValue(null)
  }
  const getLastOrder = getLastOrderFactory({ ordersRepository })

  await expect(
    getLastOrder()
  ).rejects.toMatchObject({ code: getLastOrder.codes.ORDER_NOT_EXISTS })
})

test('USE-CASE getLastOrder: gets the last order', async () => {
  const mockOrder = { id: 'order-id' }
  const ordersRepository = {
    getLast: jest.fn().mockResolvedValue(mockOrder)
  }
  const getLastOrder = getLastOrderFactory({ ordersRepository })

  const response = await getLastOrder()
  expect(response).toBe(mockOrder)
})

test('USE-CASE getLastOrder: include desired product', async () => {
  const mockOrder = { id: 'order-id', desiredProductId: 'desired-product-id' }
  const ordersRepository = {
    getLast: jest.fn().mockResolvedValue(mockOrder)
  }
  const getDesiredProduct = jest.fn()
  const getLastOrder = getLastOrderFactory({ ordersRepository, getDesiredProduct })

  await getLastOrder({ includeDesiredProduct: true })
  expect(getDesiredProduct).toBeCalledWith(mockOrder.desiredProductId)
})

test('USE-CASE getLastOrder: include supplier', async () => {
  const mockOrder = { id: 'order-id', choosenSupplierId: 'supplier-id' }
  const ordersRepository = {
    getLast: jest.fn().mockResolvedValue(mockOrder)
  }
  const getDesiredProduct = jest.fn()
  const getLastOrder = getLastOrderFactory({ ordersRepository, getDesiredProduct })

  await getLastOrder({ includeSupplier: true })
  expect(ordersRepository.getLast).toBeCalledWith({ includeSupplier: true })
})
