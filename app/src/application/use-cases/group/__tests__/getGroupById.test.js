const getGroupByIdFactory = require('../getGroupById')

test('USE-CASE getGroupById: group not exists', async () => {
  const groupsRepository = {
    getById: jest.fn().mockResolvedValue(null)
  }
  const getGroupById = getGroupByIdFactory({ groupsRepository })

  const groupId = 'un-existent-id'
  await expect(
    getGroupById(groupId)
  ).rejects.toMatchObject({ code: getGroupById.codes.GROUP_NOT_EXISTS })
})

test('USE-CASE getGroupById: gets a group', async () => {
  const mockGroup = { id: 'group-id' }
  const groupsRepository = {
    getById: jest.fn().mockResolvedValue(mockGroup)
  }
  const getGroupById = getGroupByIdFactory({ groupsRepository })

  const groupId = 'group-id'
  const response = await getGroupById(groupId)
  expect(response.id).toEqual(groupId)
})
