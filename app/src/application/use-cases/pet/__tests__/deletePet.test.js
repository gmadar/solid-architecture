const deletePetFactory = require('../deletePet')

test('USE-CASE deletePet: delete pet which not exists', async () => {
  const petsRepository = {
    getById: jest.fn().mockResolvedValue(null)
  }
  const deletePet = deletePetFactory({ petsRepository })

  const petId = 'un-existent-id'
  await expect(
    deletePet(petId)
  ).rejects.toMatchObject({ code: deletePet.codes.PET_NOT_EXISTS })
})

test('USE-CASE deletePet: deletes the pet', async () => {
  const mockPet = { id: 'pet-id' }
  const petsRepository = {
    getById: jest.fn().mockResolvedValue(mockPet),
    deleteById: jest.fn().mockResolvedValue()
  }
  const deletePet = deletePetFactory({ petsRepository })

  const petId = 'pet-id'
  await deletePet(petId)
  expect(petsRepository.deleteById).toBeCalledWith('pet-id')
})
