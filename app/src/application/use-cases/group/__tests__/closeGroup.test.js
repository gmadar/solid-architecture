const moment = require('moment')

const closeGroupFactory = require('../closeGroup')

test('USE-CASE closeGroup: old group status is updated with received status', async () => {
  const mockUpdatedGroup = {
    id: 'group-id',
    orderIds: [],
    toJSON: () => mockUpdatedGroup
  }
  const updateGroup = jest.fn().mockResolvedValue()
  const getGroupById = jest.fn().mockResolvedValue(mockUpdatedGroup)
  const createGroup = jest.fn().mockResolvedValue()
  const closeGroup = closeGroupFactory({ updateGroup, createGroup, getGroupById })

  const groupId = 'group-id'
  const options = {
    oldGroupStatus: 'NEW-STATUS'
  }
  await closeGroup(groupId, options)

  expect(updateGroup).toBeCalledWith(
    expect.objectContaining({ status: options.oldGroupStatus })
  )
})

test('USE-CASE closeGroup: old group status is updated with default', async () => {
  const mockUpdatedGroup = {
    id: 'group-id',
    orderIds: [],
    toJSON: () => mockUpdatedGroup
  }
  const updateGroup = jest.fn().mockResolvedValue()
  const getGroupById = jest.fn().mockResolvedValue(mockUpdatedGroup)
  const createGroup = jest.fn().mockResolvedValue()
  const closeGroup = closeGroupFactory({ updateGroup, createGroup, getGroupById })

  const groupId = 'group-id'
  await closeGroup(groupId)

  expect(updateGroup).toBeCalledWith(
    expect.objectContaining({ status: 'CLOSE' })
  )
})

test('USE-CASE closeGroup: new group is created with open status', async () => {
  const mockUpdatedGroup = {
    id: 'group-id',
    orderIds: [],
    toJSON: () => mockUpdatedGroup
  }
  const updateGroup = jest.fn().mockResolvedValue()
  const getGroupById = jest.fn().mockResolvedValue(mockUpdatedGroup)
  const createGroup = jest.fn().mockResolvedValue()
  const closeGroup = closeGroupFactory({ updateGroup, createGroup, getGroupById })

  const groupId = 'group-id'
  await closeGroup(groupId)

  expect(createGroup).toBeCalledWith(
    expect.objectContaining({ status: 'OPEN' })
  )
})

test('USE-CASE closeGroup: new group is created with received duration', async () => {
  const mockUpdatedGroup = {
    id: 'group-id',
    orderIds: [],
    toJSON: () => mockUpdatedGroup
  }
  const updateGroup = jest.fn().mockResolvedValue()
  const getGroupById = jest.fn().mockResolvedValue(mockUpdatedGroup)
  const createGroup = jest.fn().mockResolvedValue()
  const closeGroup = closeGroupFactory({ updateGroup, createGroup, getGroupById })

  const groupId = 'group-id'
  const options = {
    newGroupDurationDays: 10
  }
  await closeGroup(groupId, options)

  expect(createGroup).toBeCalledWith(
    expect.objectContaining({ endDate: moment().add(10, 'days').format('YYYY-MM-DD') })
  )
})

test('USE-CASE closeGroup: new group is created with same data as old group', async () => {
  const mockUpdatedGroup = {
    id: 'group-id',
    orderIds: [],
    name: 'group name',
    description: 'description',
    fakeAmount: 100,
    areaIds: [1, 2],
    cityIds: [3, 4],
    toJSON: () => mockUpdatedGroup
  }
  const updateGroup = jest.fn().mockResolvedValue()
  const getGroupById = jest.fn().mockResolvedValue(mockUpdatedGroup)
  const createGroup = jest.fn().mockResolvedValue()
  const closeGroup = closeGroupFactory({ updateGroup, createGroup, getGroupById })

  const groupId = 'group-id'
  await closeGroup(groupId)

  expect(createGroup).toBeCalledWith(
    expect.objectContaining(
      {
        name: mockUpdatedGroup.toJSON().name,
        description: mockUpdatedGroup.toJSON().description,
        fakeAmount: mockUpdatedGroup.toJSON().fakeAmount,
        areaIds: mockUpdatedGroup.toJSON().areaIds,
        cityIds: mockUpdatedGroup.toJSON().cityIds
      }
    )
  )
})

test('USE-CASE closeGroup: create new group without orders', async () => {
  const mockUpdatedGroup = {
    id: 'group-id',
    name: 'group name',
    description: 'description',
    fakeAmount: 100,
    areaIds: [1, 2],
    cityIds: [3, 4],
    orderIds: [1, 2],
    toJSON: () => mockUpdatedGroup
  }
  const updateGroup = jest.fn().mockResolvedValue()
  const getGroupById = jest.fn().mockResolvedValue(mockUpdatedGroup)
  const createGroup = jest.fn().mockResolvedValue()
  const updateOrder = jest.fn().mockResolvedValue()
  const closeGroup = closeGroupFactory({ updateGroup, createGroup, getGroupById, updateOrder })

  const groupId = 'group-id'
  await closeGroup(groupId)

  expect(createGroup.mock.calls[createGroup.mock.calls.length - 1][0])
    .not.toHaveProperty('orderIds')
})

test('USE-CASE closeGroup: update orders status to "choosing supplier"', async () => {
  const mockUpdatedGroup = {
    id: 'group-id',
    name: 'group name',
    description: 'description',
    fakeAmount: 100,
    areaIds: [1, 2],
    cityIds: [3, 4],
    orderIds: [1, 2],
    toJSON: () => mockUpdatedGroup
  }
  const updateGroup = jest.fn().mockResolvedValue()
  const getGroupById = jest.fn().mockResolvedValue(mockUpdatedGroup)
  const createGroup = jest.fn().mockResolvedValue()
  const updateOrder = jest.fn().mockResolvedValue()
  const closeGroup = closeGroupFactory({ updateGroup, createGroup, getGroupById, updateOrder })

  const groupId = 'group-id'
  await closeGroup(groupId)

  expect(updateOrder).toBeCalledTimes(2)
  expect(updateOrder).toBeCalledWith({ id: 1, status: 'CHOOSING-SUPPLIER' })
  expect(updateOrder).toBeCalledWith({ id: 2, status: 'CHOOSING-SUPPLIER' })
})
