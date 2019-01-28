const createRequest = require('../utils/request')
const moment = require('moment')

const CODE_GROUP_NOT_FOUND = 'FAIL__GROUP_NOT_FOUND'

let request, destroyUser, user
beforeAll(async () => {
  ({ request, destroyUser, user } = await createRequest())

  // delete initial group
  try {
    await deleteGroup(1)
  } catch (err) {
  }
})

afterAll(() => {
  return destroyUser()
})

test('groups: get all groups', async () => {
  const groupData =
    {
      name: 'group #1',
      status: 'OPEN',
      endDate: '2000-01-01',
      cityIds: [1, 3],
      areaIds: [1]
    }
  const createdGroup = await createGroup(groupData)

  const response = await request({ unAuthenticated: true })
    .get('/api/groups')
    .expect(200)

  const groups = response.body.data

  expect(groups).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: groupData.name,
        status: groupData.status,
        endDate: groupData.endDate,
        cityIds: groupData.cityIds,
        areaIds: groupData.areaIds
      })
    ])
  )

  await deleteGroup(createdGroup.id)
})

test('groups: get all groups - with total orders', async () => {
  const groupData =
    {
      name: 'group #1',
      status: 'OPEN',
      endDate: '2000-01-01',
      cityIds: [1, 3],
      areaIds: [1]
    }
  const createdGroup = await createGroup(groupData)

  const response = await request({ unAuthenticated: true })
    .get('/api/groups')
    .expect(200)

  const groups = response.body.data

  expect(groups).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        totalOrders: 0
      })
    ])
  )

  await deleteGroup(createdGroup.id)
})

test('groups: get all groups - with total orders + fake amount', async () => {
  const groupData =
    {
      name: 'group #1',
      status: 'OPEN',
      endDate: '2000-01-01',
      cityIds: [1, 3],
      areaIds: [1],
      fakeAmount: 100
    }
  const createdGroup = await createGroup(groupData)

  const response = await request({ unAuthenticated: true })
    .get('/api/groups')
    .expect(200)

  const groups = response.body.data

  expect(groups).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        totalOrders: 100
      })
    ])
  )

  await deleteGroup(createdGroup.id)
})

test('groups: create group', async () => {
  const groupData = {
    'name': 'group name',
    'description': 'description',
    'endDate': '1988-12-31',
    'fakeAmount': 100,
    'cityIds': [1, 2],
    'areaIds': [1]
  }
  const response = await request()
    .post('/api/groups')
    .send({ group: groupData })
    .expect(200)

  const createdGroup = response.body.data
  expect(createdGroup.name).toBe(groupData.name)
  expect(createdGroup.description).toBe(groupData.description)
  expect(createdGroup.endDate).toBe(groupData.endDate)
  expect(createdGroup.totalOrders).toBe(groupData.fakeAmount)
  expect(createdGroup.cityIds).toEqual(groupData.cityIds)
  expect(createdGroup.areaIds).toEqual(groupData.areaIds)
  expect(createdGroup.status).toBe('OPEN')

  await deleteGroup(createdGroup.id)
})

test('groups: update group', async () => {
  const groupData =
    {
      name: 'group name',
      status: 'OPEN',
      endDate: '2000-01-01',
      cityIds: [1, 2],
      areaIds: []
    }
  const createdGroup = await createGroup(groupData)

  const updateData = {
    status: 'CLOSE'
  }
  await request()
    .put(`/api/groups/${createdGroup.id}`)
    .send({ group: updateData })
    .expect(200)

  const groupAfterUpdate = await getGroup(createdGroup.id)

  expect(groupAfterUpdate.status).toBe(updateData.status)
  expect(groupAfterUpdate.name).toBe(groupData.name)
  expect(groupAfterUpdate.endDate).toBe(groupData.endDate)
  expect(groupAfterUpdate.cityIds).toEqual(groupData.cityIds)
  expect(groupAfterUpdate.areaIds).toEqual(groupData.areaIds)

  await deleteGroup(createdGroup.id)
})

test('groups: close group - original group should be closed', async () => {
  const groupData =
    {
      name: 'group name',
      endDate: '2000-01-01',
      cityIds: [1, 2],
      areaIds: [1]
    }
  const originalGroup = await createGroup(groupData)

  const response = await request()
    .post(`/api/groups/${originalGroup.id}/close`)
    .send()
    .expect(200)
  const { closedGroup, createdGroup } = response.body.data

  expect(closedGroup.status).toBe('CLOSE')

  await deleteGroup(closedGroup.id)
  await deleteGroup(createdGroup.id)
})

test('groups: close group - created group should have the same properties as the original', async () => {
  const groupData =
    {
      name: 'group name',
      endDate: '2000-01-01',
      cityIds: [1, 2],
      areaIds: [1]
    }
  const originalGroup = await createGroup(groupData)

  const response = await request()
    .post(`/api/groups/${originalGroup.id}/close`)
    .send()
    .expect(200)
  const { closedGroup, createdGroup } = response.body.data

  expect(createdGroup).toMatchObject({
    name: groupData.name,
    cityIds: groupData.cityIds,
    areaIds: groupData.areaIds
  })

  await deleteGroup(closedGroup.id)
  await deleteGroup(createdGroup.id)
})

test('groups: close group - created group should have extended end date and open status', async () => {
  const groupData =
    {
      name: 'group name',
      endDate: '2000-01-01',
      cityIds: [1, 2],
      areaIds: [1]
    }
  const originalGroup = await createGroup(groupData)

  const response = await request()
    .post(`/api/groups/${originalGroup.id}/close`)
    .send()
    .expect(200)
  const { closedGroup, createdGroup } = response.body.data

  expect(createdGroup).toMatchObject({
    status: 'OPEN',
    endDate: moment().add(14, 'days').format('YYYY-MM-DD') // default extension is 14 days
  })

  await deleteGroup(closedGroup.id)
  await deleteGroup(createdGroup.id)
})

test('groups: get group by id', async () => {
  const groupData =
    {
      name: 'group name',
      status: 'OPEN',
      endDate: '2000-01-01',
      cityIds: [1, 2],
      areaIds: []
    }
  const createdGroup = await createGroup(groupData)

  const response = await request()
    .get(`/api/groups/${createdGroup.id}`)
    .send()
    .expect(200)
  const group = response.body.data

  expect(group).toMatchObject(
    expect.objectContaining(groupData)
  )

  await deleteGroup(createdGroup.id)
})

test('groups: join a group - joinable by status', async () => {
  const revertCityUpdate = await updateUserCity(3)
  const groupData1 =
    {
      name: 'group #1',
      status: 'CLOSE',
      endDate: '2000-01-01',
      cityIds: [3],
      areaIds: []
    }
  const groupData2 =
    {
      name: 'group #2',
      status: 'OPEN',
      endDate: '2000-01-01',
      cityIds: [3],
      areaIds: []
    }
  const createdGroup1 = await createGroup(groupData1)
  const createdGroup2 = await createGroup(groupData2)

  const desiredProduct = { properties: [] }
  const response = await request()
    .post('/api/groups/join')
    .send({ order: { desiredProduct } })
    .expect(200)

  const { groupId, orderId } = response.body.data
  expect(groupId).toBe(createdGroup2.id)

  await deleteOrder(orderId)
  await deleteGroup(createdGroup1.id)
  await deleteGroup(createdGroup2.id)
  await revertCityUpdate()
})

test('groups: join a group - desired product created', async () => {
  const revertCityUpdate = await updateUserCity(3)
  const groupData =
    {
      name: 'group #1',
      status: 'OPEN',
      endDate: '2000-01-01',
      cityIds: [3],
      areaIds: []
    }
  const createdGroup = await createGroup(groupData)

  const desiredProduct = {
    properties: [
      { propertyTypeId: 'FLAVOR', values: ['DUCK'], valuesRelation: 'SINGLE' }
    ]
  }
  const response = await request()
    .post('/api/groups/join')
    .send({ order: { desiredProduct } })
    .expect(200)

  const { orderId, desiredProductId } = response.body.data
  const createdDesiredProduct = await getDesiredProduct(desiredProductId)
  expect(createdDesiredProduct.properties[0]).toMatchObject({ propertyTypeId: 'FLAVOR', value: 'DUCK' })

  await deleteOrder(orderId)
  await deleteGroup(createdGroup.id)
  await revertCityUpdate()
})

test('groups: join a group - no joinable groups by any attribute', async () => {
  expect.assertions(1)

  const revertCityUpdate = await updateUserCity(3)
  const groupData1 =
    {
      name: 'group #1',
      status: 'CLOSE',
      endDate: '2000-01-01',
      cityIds: [],
      areaIds: []
    }
  const groupData2 =
    {
      status: 'CLOSE',
      endDate: '2000-01-01',
      cityIds: [],
      areaIds: []
    }
  const createdGroup1 = await createGroup(groupData1)
  const createdGroup2 = await createGroup(groupData2)

  const desiredProduct = { properties: [] }
  try {
    await request()
      .post('/api/groups/join')
      .send({ order: { desiredProduct } })
  } catch (err) {
    expect(err.response.body.code).toBe(CODE_GROUP_NOT_FOUND)
  }

  await deleteGroup(createdGroup1.id)
  await deleteGroup(createdGroup2.id)
  await revertCityUpdate()
})

test('groups: join a group - no joinable groups by status', async () => {
  expect.assertions(1)

  const revertCityUpdate = await updateUserCity(3)
  const groupData1 =
    {
      name: 'group #1',
      status: 'CLOSE',
      endDate: '2000-01-01',
      cityIds: [3],
      areaIds: []
    }
  const groupData2 =
    {
      status: 'CLOSE',
      endDate: '2000-01-01',
      cityIds: [3],
      areaIds: []
    }
  const createdGroup1 = await createGroup(groupData1)
  const createdGroup2 = await createGroup(groupData2)

  const desiredProduct = { properties: [] }
  try {
    await request()
      .post('/api/groups/join')
      .send({ order: { desiredProduct } })
  } catch (err) {
    expect(err.response.body.code).toBe(CODE_GROUP_NOT_FOUND)
  }

  await deleteGroup(createdGroup1.id)
  await deleteGroup(createdGroup2.id)
  await revertCityUpdate()
})

/**
 it was decided to disable groups per area/city in the MVP, so tests are disabled until feature will be enabled
 **/
// test('groups: join a group - joinable by city', async () => {
//   const revertCityUpdate = await updateUserCity(3)
//   const groupData1 =
//     {
//       name: 'group #1',
//       status: 'OPEN',
//       endDate: '2000-01-01',
//       cityIds: [1, 2],
//       areaIds: []
//     }
//   const groupData2 =
//     {
//       name: 'group #2',
//       status: 'OPEN',
//       endDate: '2000-01-01',
//       cityIds: [3],
//       areaIds: []
//     }
//   const createdGroup1 = await createGroup(groupData1)
//   const createdGroup2 = await createGroup(groupData2)
//
//   const desiredProduct = { properties: [] }
//   const response = await request()
//     .post('/api/groups/join')
//     .send({ order: { desiredProduct } })
//     .expect(200)
//
//   const { groupId, orderId } = response.body.data
//   expect(groupId).toBe(createdGroup2.id)
//
//   await deleteOrder(orderId)
//   await deleteGroup(createdGroup1.id)
//   await deleteGroup(createdGroup2.id)
//   await revertCityUpdate()
// })
//
// test('groups: join a group - joinable by area', async () => {
//   const revertCityUpdate = await updateUserCity(5)
//   const groupData1 =
//     {
//       name: 'group #1',
//       status: 'OPEN',
//       endDate: '2000-01-01',
//       cityIds: [1, 2],
//       areaIds: [1, 2, 3]
//     }
//   const groupData2 =
//     {
//       name: 'group #2',
//       status: 'OPEN',
//       endDate: '2000-01-01',
//       cityIds: [],
//       areaIds: [4] // city 5 ("Haifa") belongs to area 4 ("Hatzafon")
//     }
//   const createdGroup1 = await createGroup(groupData1)
//   const createdGroup2 = await createGroup(groupData2)
//
//   const desiredProduct = { properties: [] }
//   const response = await request()
//     .post('/api/groups/join')
//     .send({ order: { desiredProduct } })
//     .expect(200)
//
//   const { groupId, orderId } = response.body.data
//   expect(groupId).toBe(createdGroup2.id)
//
//   await deleteOrder(orderId)
//   await deleteGroup(createdGroup1.id)
//   await deleteGroup(createdGroup2.id)
//   await revertCityUpdate()
// })
// test('groups: join a group - no joinable groups by city', async () => {
//   const revertCityUpdate = await updateUserCity(3)
//   const groupData1 =
//     {
//       name: 'group #1',
//       status: 'OPEN',
//       endDate: '2000-01-01',
//       cityIds: [2],
//       areaIds: []
//     }
//   const groupData2 =
//     {
//       status: 'OPEN',
//       endDate: '2000-01-01',
//       cityIds: [4],
//       areaIds: []
//     }
//   const createdGroup1 = await createGroup(groupData1)
//   const createdGroup2 = await createGroup(groupData2)
//
//   const desiredProduct = { properties: [] }
// TODO: WRAP WITH TRY CATCHE
//   const response = await request()
//     .post('/api/groups/join')
//     .send({ order: { desiredProduct } })
//     .expect(400)
//
//   const { code } = response.body
//   expect(code).toBe(CODE_GROUP_NOT_FOUND)
//
//   await deleteGroup(createdGroup1.id)
//   await deleteGroup(createdGroup2.id)
//   await revertCityUpdate()
// })
//
// test('groups: join a group - no joinable groups by area', async () => {
//   const revertCityUpdate = await updateUserCity(3) // city 3 belongs to area 1
//   const groupData1 =
//     {
//       name: 'group #1',
//       status: 'OPEN',
//       endDate: '2000-01-01',
//       cityIds: [],
//       areaIds: [2]
//     }
//   const groupData2 =
//     {
//       status: 'OPEN',
//       endDate: '2000-01-01',
//       cityIds: [],
//       areaIds: [3]
//     }
//   const createdGroup1 = await createGroup(groupData1)
//   const createdGroup2 = await createGroup(groupData2)
//
//   const desiredProduct = { properties: [] }
// TODO: WRAP WITH TRY CATCHE
//   const response = await request()
//     .post('/api/groups/join')
//     .send({ order: { desiredProduct } })
//     .expect(400)
//
//   const { code } = response.body
//   expect(code).toBe(CODE_GROUP_NOT_FOUND)
//
//   await deleteGroup(createdGroup1.id)
//   await deleteGroup(createdGroup2.id)
//   await revertCityUpdate()
// })

async function createGroup (groupData) {
  const container = require('../../src/container')
  const groupsRepository = container.resolve('groupsRepository')
  return groupsRepository.create(groupData)
}

async function getGroup (groupId) {
  const response = await request()
    .get(`/api/groups/${groupId}`)
    .expect(200)
  const group = response.body.data
  return group
}

async function deleteGroup (groupId) {
  const container = require('../../src/container')
  const groupsRepository = container.resolve('groupsRepository')
  return groupsRepository.deleteById(groupId)
}

async function deleteOrder (orderId) {
  const container = require('../../src/container')
  const ordersRepository = container.resolve('ordersRepository')
  return ordersRepository.deleteById(orderId)
}

async function updateUserCity (cityId) {
  const originalCityId = user.contact.city.id

  try {
    await request()
      .put(`/api/contacts/${user.contact.id}`)
      .send({ contact: { cityId } })
  } catch (err) {
    console.error('failed to change user city to ', cityId)
  }

  const revert = async function () {
    try {
      await request()
        .put(`/api/contacts/${user.contact.id}`)
        .send({ contact: { cityId: originalCityId } })
    } catch (err) {
      console.error('failed to revert user city back to ', originalCityId)
    }
  }
  return revert
}

async function getDesiredProduct (desiredProductId) {
  const container = require('../../src/container')
  const desiredProductsRepository = container.resolve('desiredProductsRepository')
  return desiredProductsRepository.getById(desiredProductId)
}
