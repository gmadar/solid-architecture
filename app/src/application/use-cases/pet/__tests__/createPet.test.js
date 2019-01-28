const createPetFactory = require('../createPet')

test('USE-CASE createPet: creating valid pet', async () => {
  const mockPet = { id: 'pet-id' }
  const petsRepository = {
    create: jest.fn().mockResolvedValue(mockPet)
  }
  const currentUser = { id: 0 }
  const createPet = createPetFactory({ petsRepository, currentUser })

  const petData = { animal: 'DOG', raceId: 0, properties: [] }
  const response = await createPet(petData)
  expect(response).toBe(mockPet)
})

test('USE-CASE createPet: creating invalid pet', async () => {
  const petsRepository = {}
  const currentUser = { id: 0 }
  const createPet = createPetFactory({ petsRepository, currentUser })

  const petData = {
    animal: 'non-existing-animal' // invalid pet data
  }
  await expect(
    createPet(petData)
  ).rejects.toMatchObject({ code: createPet.codes.INVALID_INPUT })
})
