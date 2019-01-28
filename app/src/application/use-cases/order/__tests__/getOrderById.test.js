const getOrderByIdFactory = require('../getOrderById')

test('USE-CASE getOrderById: order not exists', async () => {
  const ordersRepository = {
    getById: jest.fn().mockResolvedValue(null)
  }
  const currentUser = { id: 0, role: 'CONSUMER' }
  const getOrderById = getOrderByIdFactory({ ordersRepository, currentUser })

  const orderId = 'un-existent-id'
  await expect(
    getOrderById(orderId)
  ).rejects.toMatchObject({ code: getOrderById.codes.ORDER_NOT_EXISTS })
})

test('USE-CASE getOrderById: gets a order', async () => {
  const mockOrder = { id: 'order-id' }
  const ordersRepository = {
    getById: jest.fn().mockResolvedValue(mockOrder)
  }
  const currentUser = { id: 0, role: 'CONSUMER' }
  const getOrderById = getOrderByIdFactory({ ordersRepository, currentUser })

  const orderId = 'order-id'
  const response = await getOrderById(orderId)
  expect(response.id).toEqual(orderId)
})

test('USE-CASE getOrderById: consumer gets only order of his own', async () => {
  const mockOrder = { id: 'order-id' }
  const ordersRepository = {
    getById: jest.fn().mockResolvedValue(mockOrder)
  }
  const currentUser = { id: 0, role: 'CONSUMER' }
  const getOrderById = getOrderByIdFactory({ ordersRepository, currentUser })

  const orderId = 'order-id'
  await getOrderById(orderId)
  expect(ordersRepository.getById).toBeCalledWith(orderId, { currentUserOnly: true, includeSupplier: false })
})

test('USE-CASE getOrderById: admin gets order of any user', async () => {
  const mockOrder = { id: 'order-id' }
  const ordersRepository = {
    getById: jest.fn().mockResolvedValue(mockOrder)
  }
  const currentUser = { id: 0, role: 'ADMIN' }
  const getOrderById = getOrderByIdFactory({ ordersRepository, currentUser })

  const orderId = 'order-id'
  await getOrderById(orderId)
  expect(ordersRepository.getById).toBeCalledWith(orderId, { currentUserOnly: false, includeSupplier: false })
})

test('USE-CASE getOrderById: include desired product', async () => {
  const mockOrder = { id: 'order-id', desiredProductId: 'desired-product-id' }
  const ordersRepository = {
    getById: jest.fn().mockResolvedValue(mockOrder)
  }
  const currentUser = { id: 0, role: 'CONSUMER' }
  const getDesiredProduct = jest.fn()
  const getOrderById = getOrderByIdFactory({ ordersRepository, getDesiredProduct, currentUser })

  await getOrderById(mockOrder.id, { includeDesiredProduct: true })
  expect(getDesiredProduct).toBeCalledWith(mockOrder.desiredProductId)
})

test('USE-CASE getOrderById: include supplier', async () => {
  const mockOrder = { id: 'order-id', chosenSupplierId: 'supplier-id' }
  const ordersRepository = {
    getById: jest.fn().mockResolvedValue(mockOrder)
  }
  const currentUser = { id: 0, role: 'CONSUMER' }
  const getDesiredProduct = jest.fn()
  const getOrderById = getOrderByIdFactory({ ordersRepository, getDesiredProduct, currentUser })

  await getOrderById(mockOrder.id, { includeSupplier: true })
  expect(ordersRepository.getById).toBeCalledWith(mockOrder.id, { currentUserOnly: true, includeSupplier: true })
})
