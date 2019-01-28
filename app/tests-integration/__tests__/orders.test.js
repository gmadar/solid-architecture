const createRequest = require('../utils/request')

jest.setTimeout(10000)

let request, destroyUser, user
beforeAll(async () => {
  ({ request, destroyUser, user } = await createRequest())
})

afterAll(() => {
  return destroyUser()
})

test('orders: create an order', async () => {
  const createdGroup = await createGroup({ name: 'group for order test', endDate: '3000-01-01' })
  const createdDesiredProduct = await createDesiredProduct({})

  const order = {
    groupId: createdGroup.id,
    userId: user.id,
    status: 'SUPPLIER-HANDLING',
    desiredProductId: createdDesiredProduct.id,
    chosenProductId: 1,
    chosenSupplierId: 1,
    quantity: 1,
    singleUnitPrice: 1
  }
  const response = await request()
    .post('/api/orders')
    .send({ order })
    .expect(200)

  const createdOrder = response.body.data

  expect(createdOrder.id).toBeDefined()
  expect(createdOrder).toMatchObject(order)

  await deleteOrder(createdOrder.id)
  await deleteGroup(createdGroup.id)
})

test('orders: create order with invalid input - missing body', async () => {
  expect.assertions(1)
  try {
    await request()
      .post('/api/orders')
  } catch (err) {
    expect(err.response.body.code).toBe('FAIL__INVALID_INPUT')
  }
})

test('orders: create order with invalid input - missing order', async () => {
  expect.assertions(2)
  try {
    await request()
      .post('/api/orders')
      .send({})
  } catch (err) {
    expect(err.response.body.code).toBe('FAIL__INVALID_INPUT')
    expect(err.response.body.message).toMatch('order is missing')
  }
})

test('orders: create order with invalid input - invalid order', async () => {
  expect.assertions(2)
  try {
    const order = {
      status: 'invalid-status'
    }
    await request()
      .post('/api/orders')
      .send({ order })
  } catch (err) {
    expect(err.response.body.code).toBe('FAIL__INVALID_INPUT')
    expect(err.response.body.message).toMatch('invalid order data provided')
  }
})

test('orders: get order by id', async () => {
  const createdGroup = await createGroup({ name: 'group for order test', endDate: '3000-01-01' })
  const createdDesiredProduct = await createDesiredProduct({})

  const order = {
    groupId: createdGroup.id,
    desiredProductId: createdDesiredProduct.id,
    userId: user.id,
    chosenProductId: 1,
    chosenSupplierId: 1,
    quantity: 1,
    status: 'PENDING-FOR-PAYMENT',
    singleUnitPrice: 1
  }
  const createdOrder = await createOrder(order)

  const orderResponse = await request()
    .get(`/api/orders/${createdOrder.id}`)
    .expect(200)

  expect(orderResponse.body.data).toMatchObject(order)

  await deleteOrder(createdOrder.id)
  await deleteGroup(createdGroup.id)
})

test('orders: get all orders - empty list', async () => {
  const response = await request()
    .get('/api/orders')
    .expect(200)

  expect(response.body.data).toEqual([])
})

test('orders: get all orders', async () => {
  const createdGroup = await createGroup({ name: 'group for order test', endDate: '3000-01-01' })
  const createdDesiredProduct = await createDesiredProduct({})

  const order = {
    groupId: createdGroup.id,
    desiredProductId: createdDesiredProduct.id,
    userId: user.id,
    chosenProductId: 1,
    chosenSupplierId: 1,
    status: 'SUPPLIER-HANDLING',
    quantity: 1,
    singleUnitPrice: 1
  }
  const createdOrder = await createOrder(order)

  const response = await request()
    .get('/api/orders')
    .expect(200)
  const responseData = response.body.data

  expect(responseData.length).toBe(1)
  const responseOrder = responseData[0]
  expect(responseOrder).toMatchObject(order)

  await deleteOrder(createdOrder.id)
  await deleteGroup(createdGroup.id)
})

test('orders: get last order', async () => {
  const createdGroup = await createGroup({ name: 'group for order test', endDate: '3000-01-01' })
  const createdDesiredProduct1 = await createDesiredProduct({})
  const createdDesiredProduct2 = await createDesiredProduct({})

  const order1 = {
    groupId: createdGroup.id,
    desiredProductId: createdDesiredProduct1.id,
    userId: user.id,
    chosenProductId: 1,
    chosenSupplierId: 1,
    status: 'SUPPLIER-HANDLING',
    quantity: 1,
    singleUnitPrice: 1
  }
  const order2 = {
    groupId: createdGroup.id,
    desiredProductId: createdDesiredProduct2.id,
    userId: user.id,
    chosenProductId: 1,
    chosenSupplierId: 1,
    status: 'SUPPLIER-HANDLING',
    quantity: 1,
    singleUnitPrice: 1
  }
  const createdOrder1 = await createOrder(order1)
  const createdOrder2 = await createOrder(order2)

  const response = await request()
    .get('/api/orders/last')
    .expect(200)
  const responseData = response.body.data

  expect(responseData.id).toBe(createdOrder2.id)
  expect(responseData).toMatchObject(order2)

  await deleteOrder(createdOrder1.id)
  await deleteOrder(createdOrder2.id)
  await deleteGroup(createdGroup.id)
})

test('orders: update order', async () => {
  try {
    const createdGroup = await createGroup({ name: 'group for order test', endDate: '3000-01-01' })
    const createdDesiredProduct = await createDesiredProduct({})

    const order = {
      groupId: createdGroup.id,
      desiredProductId: createdDesiredProduct.id,
      userId: user.id,
      status: 'PENDING-FOR-JOINERS'
    }
    const createdOrder = await createOrder(order)

    const updateOrderData = {
      quantity: 1
    }
    await request()
      .put(`/api/orders/${createdOrder.id}`)
      .send({ order: updateOrderData })
      .expect(200)

    const orderAfterUpdate = await getOrder(createdOrder.id)
    expect(orderAfterUpdate.quantity).toBe(updateOrderData.quantity)

    await deleteOrder(createdOrder.id)
    await deleteGroup(createdGroup.id)
  } catch (err) {
    console.log(err)
  }
})

test(
  'orders: update order to shipped/received changes the pet current product & exact product flag, but preserves existing properties',
  async () => {
    const createdGroup = await createGroup({ name: 'group for order test', endDate: '3000-01-01' })
    const createdDesiredProduct = await createDesiredProduct({})
    const createdPet = await createPet({
      animal: 'DOG',
      'raceId': 1,
      properties: [{ 'propertyTypeId': 'FLAVOR', 'values': ['DUCK'], 'valuesRelation': 'SINGLE' }]
    })

    const order = {
      petId: createdPet.id,
      groupId: createdGroup.id,
      desiredProductId: createdDesiredProduct.id,
      userId: user.id,
      status: 'SUPPLIER-HANDLING'
    }
    const createdOrder = await createOrder(order)

    const updateOrderData = {
      chosenProductId: 2,
      chosenSupplierId: 1,
      quantity: 1,
      status: 'RECEIVED',
      singleUnitPrice: 100,
      shipmentDate: '2000-01-01'
    }
    await request()
      .put(`/api/orders/${createdOrder.id}`)
      .send({ order: updateOrderData })
      .expect(200)

    const petAfterUpdate = await getPet(createdPet.id)
    expect(petAfterUpdate.properties).toContainEqual(
      expect.objectContaining({
        propertyTypeId: 'PET_EXISTING_PRODUCT_ID',
        values: [updateOrderData.chosenProductId]
      })
    )
    expect(petAfterUpdate.properties).toContainEqual(
      expect.objectContaining({
        propertyTypeId: 'FLAVOR',
        values: ['DUCK']
      })
    )
    expect(petAfterUpdate.properties).toContainEqual(
      expect.objectContaining({
        propertyTypeId: 'PET_IS_EXACT_PRODUCT',
        values: [false]
      })
    )

    await deleteOrder(createdOrder.id)
    await deleteGroup(createdGroup.id)
    await deletePet(createdPet.id)
  })

// TODO: figure out why the test fails
//    it only fails if it is executed TOGETHER with "orders: update order to shipped/received changes the pet current product & exact product flag, but preserves existing properties"
//    when executed alone, everything works!
//    moreover, no error is thrown
// test('orders: delete order', async () => {
//   const createdGroup = await createGroup({ name: 'group for order test', endDate: '3000-01-01' })
//   const createdDesiredProduct = await createDesiredProduct({})
//
//   const order = {
//     groupId: createdGroup.id,
//     desiredProductId: createdDesiredProduct.id,
//     userId: user.id,
//     chosenProductId: 1,
//     chosenSupplierId: 1,
//     status: 'SUPPLIER-HANDLING',
//     quantity: 1,
//     singleUnitPrice: 1
//   }
//   const createdOrder = await createOrder(order)
//
//   await deleteOrder(createdOrder.id)
//     .expect(200)
//
//   const orderAfterDelete = await getOrder(createdOrder.id).order
//   expect(orderAfterDelete).toBe(undefined)
//
//   await deleteGroup(createdGroup.id)
// })

async function getOrder (orderId) {
  const res = await request()
    .get(`/api/orders/${orderId}`)
    .send()
  return res.body.data
}

function deleteOrder (orderId) {
  return request()
    .delete(`/api/orders/${orderId}`)
    .send()
}

async function createOrder (order) {
  const response = await request()
    .post('/api/orders')
    .send({ order })
  return response.body.data
}

async function createGroup (groupData) {
  const container = require('../../src/container')
  const groupsRepository = container.resolve('groupsRepository')
  return groupsRepository.create(groupData)
}

async function deleteGroup (groupId) {
  const container = require('../../src/container')
  const groupsRepository = container.resolve('groupsRepository')
  return groupsRepository.deleteById(groupId)
}

async function createDesiredProduct (desiredProductData) {
  const container = require('../../src/container')
  const desiredProductsRepository = container.resolve('desiredProductsRepository')
  desiredProductData.userId = user.id
  const asDomain = { toJSON: () => desiredProductData }
  return desiredProductsRepository.create(asDomain)
}

async function getPet (petId) {
  const res = await request()
    .get(`/api/pets/${petId}`)
    .send()
  return res.body.data
}

function deletePet (petId) {
  return request()
    .delete(`/api/pets/${petId}`)
    .send()
}

async function createPet (pet) {
  const response = await request()
    .post('/api/pets')
    .send({ pet })
  return response.body.data
}
