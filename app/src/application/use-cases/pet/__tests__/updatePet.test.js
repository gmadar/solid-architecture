const updatePetFactory = require('../updatePet')

test('USE-CASE updatePet: updates a pet', async () => {
  const petData = { id: 123, animal: 'DOG', raceId: 0, properties: [] }
  const petsRepository = {
    update: jest.fn().mockResolvedValue(),
    getById: jest.fn().mockResolvedValue({ toJSON: () => petData })
  }
  const currentUser = { id: 0 }
  const updatePet = updatePetFactory({ petsRepository, currentUser })

  await updatePet(petData)
  expect(petsRepository.update).toBeCalled()
})

test('USE-CASE updatePet: invalid pet data - wrong animal', async () => {
  const petsRepository = {
    update: jest.fn().mockRejectedValue(new Error()),
    getById: jest.fn().mockResolvedValue({ toJSON: () => ({}) })
  }
  const currentUser = { id: 0 }
  const updatePet = updatePetFactory({ petsRepository, currentUser })

  const petData = {
    id: 123,
    animal: 'non-existing-animal', // invalid pet data
    raceId: 0
  }
  await expect(
    updatePet(petData)
  ).rejects.toMatchObject({ code: updatePet.codes.INVALID_INPUT })
})

test('USE-CASE updatePet: invalid pet data - missing id', async () => {
  const petsRepository = {
    update: jest.fn().mockRejectedValue(new Error())
  }
  const currentUser = { id: 0 }
  const updatePet = updatePetFactory({ petsRepository, currentUser })

  const petData = {
    animal: 'DOG',
    raceId: 0
  }
  await expect(
    updatePet(petData)
  ).rejects.toMatchObject({ code: updatePet.codes.INVALID_INPUT })
})

test('USE-CASE updatePet: pet not exists', async () => {
  const petsRepository = {
    update: jest.fn().mockRejectedValue(new Error()),
    getById: jest.fn().mockResolvedValue(null)
  }
  const updatePet = updatePetFactory({ petsRepository })
  await expect(
    updatePet({ id: 'unexistent-pet-id' })
  ).rejects.toMatchObject({ code: updatePet.codes.PET_NOT_EXISTS })
})

test('USE-CASE updatePet: update fails', async () => {
  const petsRepository = {
    update: jest.fn().mockRejectedValue(new Error())
  }
  const updateDesiredProduct = { codes: {} }
  const currentUser = { id: 0 }
  const updatePet = updatePetFactory({ petsRepository, updateDesiredProduct, currentUser })

  const petData = {
    id: -1, // un-existent-id
    animal: 'DOG',
    raceId: 0
  }
  const responsePromise = updatePet(petData)
  await expect(responsePromise).rejects.toThrow()
})

test('USE-CASE updatePet: preserve existing properties flag is passed', async () => {
  const petData = { id: 123, animal: 'DOG', raceId: 0, properties: [] }
  const petsRepository = {
    update: jest.fn().mockResolvedValue(),
    getById: jest.fn().mockResolvedValue({ toJSON: () => petData })
  }
  const currentUser = { id: 0 }
  const updatePet = updatePetFactory({ petsRepository, currentUser })

  await updatePet(petData, { preserveExistingProperties: true })
  expect(petsRepository.update.mock.calls[0][1]).toEqual({ preserveExistingProperties: true })
})
