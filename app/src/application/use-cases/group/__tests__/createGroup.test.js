const createGroupFactory = require('../createGroup')

test('USE-CASE createGroup: creating group', async () => {
  const mockGroup = { id: 'group-id' }
  const groupsRepository = {
    create: jest.fn().mockResolvedValue(mockGroup)
  }
  const createGroup = createGroupFactory({ groupsRepository })

  const groupData = { endDate: '1988-12-31', status: 'OPEN' }
  const response = await createGroup(groupData)
  expect(response).toBe(mockGroup)
})

test('USE-CASE createGroup: creating invalid group', async () => {
  const groupsRepository = {}
  const createGroup = createGroupFactory({ groupsRepository })

  const groupData = {
    status: 'non-existing-status' // invalid group data
  }
  await expect(
    createGroup(groupData)
  ).rejects.toMatchObject({ code: createGroup.codes.INVALID_INPUT })
})
