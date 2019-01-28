const getUserByAuthProviderFactory = require('../getUserByAuthProvider')

test('USE-CASE getUserByAuthProvider: get user', async () => {
  const mockUser = {}
  const usersRepository = { getByAuthProvider: jest.fn().mockResolvedValue(mockUser) }
  const getUserByAuthProviderSpec = getUserByAuthProviderFactory({ usersRepository })

  const responseUser = await getUserByAuthProviderSpec('fake-id', 'FACEBOOK')
  expect(responseUser).toBe(mockUser)
  expect(usersRepository.getByAuthProvider.mock.calls.length).toBe(1)
})

test('USE-CASE getUserByAuthProvider: get non-existing user', async () => {
  const usersRepository = { getByAuthProvider: jest.fn().mockResolvedValue(undefined) }
  const getUserByAuthProviderSpec = getUserByAuthProviderFactory({ usersRepository })

  const returnedPromise = getUserByAuthProviderSpec('fake-id', 'FACEBOOK')
  await expect(returnedPromise).rejects.toThrow('user auth provider "fake-id" of "FACEBOOK" provider not exists')
})
