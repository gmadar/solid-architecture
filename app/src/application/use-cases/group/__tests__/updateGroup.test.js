const updateGroupFactory = require('../updateGroup')

test('USE-CASE updateGroup: updates a group', async () => {
  const groupData = {
    id: 1,
    status: 'OPEN',
    endDate: '3000-01-01'
  }
  const groupsRepository = {
    update: jest.fn().mockResolvedValue(),
    getById: jest.fn().mockResolvedValue({ toJSON: () => groupData })
  }
  const currentUser = { id: 0 }
  const updateGroup = updateGroupFactory({ groupsRepository, currentUser })

  await updateGroup(groupData)
  expect(groupsRepository.update).toBeCalled()
})

test('USE-CASE updateGroup: invalid group data', async () => {
  const groupData = {
    id: 1
    // missing end date makes group invalid
  }
  const groupsRepository = {
    update: jest.fn().mockRejectedValue(new Error()),
    getById: jest.fn().mockResolvedValue({ toJSON: () => groupData })
  }
  const updateGroup = updateGroupFactory({ groupsRepository })
  await expect(
    updateGroup(groupData)
  ).rejects.toMatchObject({ code: updateGroup.codes.INVALID_INPUT })
})

test('USE-CASE updateGroup: group not exists', async () => {
  const groupsRepository = {
    update: jest.fn().mockRejectedValue(new Error()),
    getById: jest.fn().mockResolvedValue(null)
  }
  const updateGroup = updateGroupFactory({ groupsRepository })
  await expect(
    updateGroup({ id: 'unexistent-group-id' })
  ).rejects.toMatchObject({ code: updateGroup.codes.GROUP_NOT_EXISTS })
})

test('USE-CASE updateGroup: update fails', async () => {
  const groupsRepository = {
    update: jest.fn().mockRejectedValue(new Error())
  }
  const updateGroup = updateGroupFactory({ groupsRepository })

  const groupData = {
    id: 1,
    endDate: '3000-01-01'
  }
  const responsePromise = updateGroup(groupData)
  await expect(responsePromise).rejects.toThrow()
})
