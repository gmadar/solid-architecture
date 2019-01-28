const getUserByIdFactory = require('../getUserById')

test('USE-CASE getUserById: get user', async () => {
  const mockUser = {}
  const usersRepository = { getById: jest.fn().mockResolvedValue(mockUser) }
  const getUserById = getUserByIdFactory({ usersRepository })

  const responseUser = await getUserById('id')
  expect(responseUser).toBe(mockUser)
  expect(usersRepository.getById.mock.calls.length).toBe(1)
})

test('USE-CASE getUserById: get non-existing user', async () => {
  const usersRepository = { getById: jest.fn().mockResolvedValue(undefined) }
  const getUserById = getUserByIdFactory({ usersRepository })

  const returnedPromise = getUserById('fake-id')
  await expect(returnedPromise).rejects.toThrow('user with id "fake-id" not exists')
})
