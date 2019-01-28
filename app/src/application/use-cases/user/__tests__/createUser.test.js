const createUserFactory = require('../createUser')

test('USE-CASE createUser: creates valid user', async () => {
  const mockUser = { id: 'id-1' }
  const usersRepository = { create: jest.fn().mockResolvedValue(mockUser) }
  const createUser = createUserFactory({ usersRepository })

  const userData = {
    'contact': {
      'name': 'liran',
      'email': 'liranbri@gmail.com'
    }
  }
  const returnedCreatedUser = await createUser(userData)
  expect(usersRepository.create.mock.calls.length).toBe(1)
  expect(returnedCreatedUser).toBe(mockUser)
})

test('USE-CASE createUser: creates invalid user', async () => {
  const createUser = createUserFactory({ })

  const userData = {} // invalid due to missing contact

  const createUserPromise = createUser(userData)
  await expect(createUserPromise).rejects.toThrow('invalid user data provided')
})
