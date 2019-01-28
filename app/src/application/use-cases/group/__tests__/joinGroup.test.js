const joinGroupFactory = require('../joinGroup')

test('USE-CASE joinGroup: no desired product provided', async () => {
  const joinGroup = joinGroupFactory({})
  await expect(
    joinGroup()
  ).rejects.toMatchObject({ code: joinGroup.codes.INVALID_INPUT })
})

test('USE-CASE joinGroup: user without city', async () => {
  const currentUser = {
    contact: {
      city: undefined
    }
  }
  const joinGroup = joinGroupFactory({ currentUser })
  const order = { desiredProduct: {} }
  await expect(
    joinGroup(order)
  ).rejects.toMatchObject({ code: joinGroup.codes.USER_WITHOUT_CITY })
})

test('USE-CASE joinGroup: no joinable group found', async () => {
  const currentUser = {
    contact: { city: { id: 1 } }
  }
  const groupsRepository = {
    getAll: jest.fn().mockResolvedValue([
      { isJoinable: () => false }
    ])
  }
  const joinGroup = joinGroupFactory({ currentUser, groupsRepository })
  const order = { desiredProduct: {} }
  await expect(
    joinGroup(order)
  ).rejects.toMatchObject({ code: joinGroup.codes.GROUP_NOT_FOUND })
})

test('USE-CASE joinGroup: joins to the first joinable group found', async () => {
  const currentUser = {
    contact: { city: { id: 1 } }
  }
  const groupsRepository = {
    getAll: jest.fn().mockResolvedValue([
      { id: 'group-id-1', orderIds: [], isJoinable: () => false },
      { id: 'group-id-2', orderIds: [], isJoinable: () => true },
      { id: 'group-id-3', orderIds: [], isJoinable: () => true }
    ]),
    update: jest.fn().mockResolvedValue()
  }
  const createDesiredProduct = jest.fn().mockResolvedValue({ id: 'created-desired-product-id' })
  const createOrder = jest.fn().mockResolvedValue({ id: 'created-order-id' })
  const joinGroup = joinGroupFactory({ groupsRepository, createDesiredProduct, createOrder, currentUser })

  const order = { desiredProduct: {} }
  const { groupId } = await joinGroup(order)

  expect(groupId).toBe('group-id-2')
})

test('USE-CASE joinGroup: creates a new instance of desired product', async () => {
  const currentUser = {
    contact: { city: { id: 1 } }
  }
  const createDesiredProduct = jest.fn().mockResolvedValue({ id: 'created-desired-product-id' })

  const groupsRepository = {
    getAll: jest.fn().mockResolvedValue([
      { id: 'group-id-1', orderIds: [], isJoinable: () => true }
    ]),
    update: jest.fn().mockResolvedValue()
  }
  const createOrder = jest.fn().mockResolvedValue({ id: 'created-order-id' })
  const joinGroup = joinGroupFactory({ groupsRepository, createDesiredProduct, createOrder, currentUser })

  const desiredProduct = {
    'properties': [
      { 'propertyTypeId': 'PET_WEIGHT', 'valuesRelation': 'RANGE', 'values': [2000, 2000] },
      { 'propertyTypeId': 'FLAVOR', 'valuesRelation': 'SINGLE', 'values': ['DUCK'] }
    ],
    'existingProductId': 1,
    'exactExistingProduct': true,
    'baseDesiredProductId': 1
  }
  const order = {
    desiredProduct
  }
  await joinGroup(order)

  expect(createDesiredProduct).toBeCalledWith(
    expect.objectContaining(desiredProduct)
  )
})

test('USE-CASE joinGroup: creates a order', async () => {
  const currentUser = {
    id: 'user-id',
    contact: { city: { id: 1 } }
  }
  const createDesiredProduct = jest.fn().mockResolvedValue({ id: 'created-desired-product-id' })

  const groupsRepository = {
    getAll: jest.fn().mockResolvedValue([
      { id: 'group-id-1', orderIds: [], isJoinable: () => true }
    ]),
    update: jest.fn().mockResolvedValue()
  }
  const createOrder = jest.fn().mockResolvedValue({ id: 'created-order-id' })
  const joinGroup = joinGroupFactory({ groupsRepository, createDesiredProduct, createOrder, currentUser })

  const desiredProduct = {
    'properties': [
      { 'propertyTypeId': 'PET_WEIGHT', 'valuesRelation': 'RANGE', 'values': [2000, 2000] },
      { 'propertyTypeId': 'FLAVOR', 'valuesRelation': 'SINGLE', 'values': ['DUCK'] }
    ],
    'existingProductId': 1,
    'exactExistingProduct': true,
    'baseDesiredProductId': 1
  }
  const order = {
    desiredProduct
  }
  await joinGroup(order)

  expect(createOrder).toBeCalledWith({
    desiredProductId: 'created-desired-product-id',
    groupId: 'group-id-1',
    userId: 'user-id',
    status: 'PENDING-FOR-JOINERS'
  })
})

test('USE-CASE joinGroup: return the created desired product id', async () => {
  const currentUser = {
    contact: { city: { id: 1 } }
  }
  const createDesiredProduct = jest.fn().mockResolvedValue({ id: 'created-desired-product-id' })
  const groupsRepository = {
    getAll: jest.fn().mockResolvedValue([
      { id: 'group-id-1', orderIds: [], isJoinable: () => true }
    ]),
    update: jest.fn().mockResolvedValue()
  }
  const createOrder = jest.fn().mockResolvedValue({ id: 'created-order-id' })
  const joinGroup = joinGroupFactory({ groupsRepository, createDesiredProduct, createOrder, currentUser })

  const order = { desiredProduct: {} }
  const { desiredProductId } = await joinGroup(order)

  expect(desiredProductId).toBe('created-desired-product-id')
})

test('USE-CASE joinGroup: return the joined group id', async () => {
  const currentUser = {
    contact: { city: { id: 1 } }
  }
  const createDesiredProduct = jest.fn().mockResolvedValue({ id: 'created-desired-product-id' })
  const groupsRepository = {
    getAll: jest.fn().mockResolvedValue([
      { id: 'group-id-1', orderIds: [], isJoinable: () => true }
    ]),
    update: jest.fn().mockResolvedValue()
  }
  const createOrder = jest.fn().mockResolvedValue({ id: 'created-order-id' })
  const joinGroup = joinGroupFactory({ groupsRepository, createDesiredProduct, createOrder, currentUser })

  const order = { desiredProduct: {} }
  const { groupId } = await joinGroup(order)

  expect(groupId).toBe('group-id-1')
})

test('USE-CASE joinGroup: return the created order id', async () => {
  const currentUser = {
    contact: { city: { id: 1 } }
  }
  const createDesiredProduct = jest.fn().mockResolvedValue({ id: 'created-desired-product-id' })
  const groupsRepository = {
    getAll: jest.fn().mockResolvedValue([
      { id: 'group-id-1', orderIds: [], isJoinable: () => true }
    ]),
    update: jest.fn().mockResolvedValue()
  }
  const createOrder = jest.fn().mockResolvedValue({ id: 'created-order-id' })
  const joinGroup = joinGroupFactory({ groupsRepository, createDesiredProduct, createOrder, currentUser })

  const order = { desiredProduct: {} }
  const { orderId } = await joinGroup(order)

  expect(orderId).toBe('created-order-id')
})
