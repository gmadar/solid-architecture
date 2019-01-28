const updateOrderFactory = require('../updateOrder')

test('USE-CASE updateOrder: updates an order', async () => {
  const orderData = {
    id: 1,
    groupId: 1,
    userId: 1,
    desiredProductId: 1,
    chosenProductId: 1,
    chosenSupplierId: 1,
    status: 'SHIPPED',
    quantity: 1,
    singleUnitPrice: 1,
    shipmentDate: '2010-01-01',
    paymentMethod: 'PAYPAL'
  }
  const ordersRepository = {
    update: jest.fn().mockResolvedValue(),
    getById: jest.fn().mockResolvedValue({ toJSON: () => orderData })
  }
  const currentUser = { id: 0, role: 'ADMIN' }
  const updateOrder = updateOrderFactory({ ordersRepository, currentUser })

  await updateOrder(orderData)
  expect(ordersRepository.update).toBeCalled()
})

test('USE-CASE updateOrder: updates an order with pet to shipped also updates the pet current product', async () => {
  const orderData = {
    id: 1,
    groupId: 1,
    userId: 1,
    petId: 1,
    desiredProductId: 1,
    chosenProductId: 1,
    chosenSupplierId: 1,
    status: 'SHIPPED',
    quantity: 1,
    singleUnitPrice: 1,
    shipmentDate: '2010-01-01',
    paymentMethod: 'PAYPAL'
  }
  const ordersRepository = {
    update: jest.fn().mockResolvedValue(),
    getById: jest.fn().mockResolvedValue({ toJSON: () => orderData })
  }
  const currentUser = { id: 0, role: 'ADMIN' }
  const setPetExistingProduct = jest.fn()
  const updateOrder = updateOrderFactory({ ordersRepository, currentUser, setPetExistingProduct })

  await updateOrder(orderData)
  expect(setPetExistingProduct).toBeCalledWith(orderData.petId, orderData.chosenProductId)
})

test('USE-CASE updateOrder: consumer can update only his own orders', async () => {
  const existingOrderData = {
    id: 1,
    groupId: 1,
    userId: 1,
    petId: 1,
    desiredProductId: 1,
    status: 'PENDING-FOR-JOINERS'
  }
  const updateOrderData = {
    id: 1,
    notes: 'notes'
  }
  const ordersRepository = {
    update: jest.fn().mockResolvedValue(),
    getById: jest.fn().mockResolvedValue({ toJSON: () => existingOrderData })
  }
  const currentUser = { id: 0, role: 'CONSUMER' }
  const updateOrder = updateOrderFactory({ ordersRepository, currentUser })

  await updateOrder(updateOrderData)
  expect(ordersRepository.getById).toBeCalledWith(updateOrderData.id, { currentUserOnly: true })
})

test('USE-CASE updateOrder: invalid order data', async () => {
  const orderData = {
    id: 1,
    groupId: 1,
    userId: 1,
    desiredProductId: 1,
    chosenProductId: 1,
    chosenSupplierId: 1,
    status: 'NON-EXISTENT-STATUS', // status not exists
    quantity: 1,
    singleUnitPrice: 1,
    paymentMethod: 'PAYPAL'
  }
  const ordersRepository = {
    update: jest.fn().mockRejectedValue(new Error()),
    getById: jest.fn().mockResolvedValue({ toJSON: () => orderData })
  }
  const currentUser = { id: 0, role: 'ADMIN' }
  const updateOrder = updateOrderFactory({ ordersRepository, currentUser })
  await expect(
    updateOrder(orderData)
  ).rejects.toMatchObject({ code: updateOrder.codes.INVALID_INPUT })
})

test('USE-CASE updateOrder: illegal order state', async () => {
  const existingOrderData = {
    id: 1,
    groupId: 1,
    userId: 1,
    petId: 1,
    desiredProductId: 1
  }
  const updateOrderData = {
    id: 1,
    // chosen product is missing hence makes state illegal
    chosenSupplierId: 1,
    status: 'SHIPPED',
    quantity: 1,
    singleUnitPrice: 1,
    shipmentDate: '2010-01-01',
    paymentMethod: 'PAYPAL'
  }
  const ordersRepository = {
    update: jest.fn().mockRejectedValue(new Error()),
    getById: jest.fn().mockResolvedValue({ toJSON: () => existingOrderData })
  }
  const currentUser = { id: 0, role: 'ADMIN' }
  const updateOrder = updateOrderFactory({ ordersRepository, currentUser })
  await expect(
    updateOrder(updateOrderData)
  ).rejects.toMatchObject({ code: updateOrder.codes.ILLEGAL_STATE })
})

test('USE-CASE updateOrder: order not exists', async () => {
  const ordersRepository = {
    update: jest.fn().mockRejectedValue(new Error()),
    getById: jest.fn().mockResolvedValue(null)
  }
  const currentUser = { id: 0, role: 'ADMIN' }
  const updateOrder = updateOrderFactory({ ordersRepository, currentUser })
  await expect(
    updateOrder({ id: 'unexistent-order-id' })
  ).rejects.toMatchObject({ code: updateOrder.codes.ORDER_NOT_EXISTS })
})

test('USE-CASE updateOrder: update fails', async () => {
  const ordersRepository = {
    update: jest.fn().mockRejectedValue(new Error())
  }
  const currentUser = { id: 0, role: 'ADMIN' }
  const updateOrder = updateOrderFactory({ ordersRepository, currentUser })

  const orderData = {
    id: 1,
    groupId: 1,
    userId: 1,
    desiredProductId: 1,
    chosenProductId: 1,
    chosenSupplierId: 1,
    status: 'SHIPPED',
    quantity: 1,
    singleUnitPrice: 1,
    paymentMethod: 'PAYPAL'
  }
  const responsePromise = updateOrder(orderData)
  await expect(responsePromise).rejects.toThrow()
})

test('USE-CASE updateOrder: update fails if consumer tries to update limited fields', async () => {
  const existingOrderData = {
    id: 1,
    groupId: 1,
    userId: 1,
    petId: 1,
    desiredProductId: 1,
    status: 'PENDING-FOR-JOINERS'
  }
  const updateOrderData = {
    id: 1,
    singleUnitPrice: 100 // consumer not allowed to update this field
  }
  const ordersRepository = {
    update: jest.fn().mockResolvedValue(),
    getById: jest.fn().mockResolvedValue({ toJSON: () => existingOrderData })
  }
  const currentUser = { id: 0, role: 'CONSUMER' }
  const updateOrder = updateOrderFactory({ ordersRepository, currentUser })

  await expect(
    updateOrder(updateOrderData)
  ).rejects.toMatchObject({ code: updateOrder.codes.UNAUTHORIZED })
})
