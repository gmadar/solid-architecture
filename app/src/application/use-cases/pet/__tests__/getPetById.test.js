const getPetByIdFactory = require('../getPetById')

test('USE-CASE getPetById: pet not exists', async () => {
  const petsRepository = {
    getById: jest.fn().mockResolvedValue(null)
  }
  const getPetById = getPetByIdFactory({ petsRepository })

  const petId = 'un-existent-id'
  await expect(
    getPetById(petId)
  ).rejects.toMatchObject({ code: getPetById.codes.PET_NOT_EXISTS })
})

test('USE-CASE getPetById: gets a pet', async () => {
  const mockPet = { id: 'pet-id' }
  const petsRepository = {
    getById: jest.fn().mockResolvedValue(mockPet)
  }
  const getPetById = getPetByIdFactory({ petsRepository })

  const petId = 'pet-id'
  const response = await getPetById(petId)
  expect(response.id).toEqual(petId)
})
