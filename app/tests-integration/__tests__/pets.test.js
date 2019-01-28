const createRequest = require('../utils/request')

let request, destroyUser
beforeAll(async () => {
  ({ request, destroyUser } = await createRequest())
})

afterAll(() => {
  return destroyUser()
})

test('pets: create a pet without properties', async () => {
  const pet = {
    'animal': 'DOG',
    'name': 'pet name',
    'raceId': 2,
    'properties': []
  }

  const response = await request()
    .post('/api/pets')
    .send({ pet })
    .expect(200)

  const createdPet = response.body.data

  expect(createdPet.properties.length).toBe(0)
  expect(createdPet.id).toBeDefined()
  expect(createdPet.name).toBe(pet.name)
  expect(createdPet.animal).toBe(pet.animal)
  expect(createdPet.raceId).toBe(pet.raceId)
  expect(createdPet.ownerUserId).toBeDefined()

  await deletePet(createdPet.id)
})

test('pets: create a pet with properties', async () => {
  const pet = {
    'animal': 'DOG',
    'name': 'pet name',
    'raceId': 2,
    'properties': [
      { 'propertyTypeId': 'PET_WEIGHT', 'valuesRelation': 'RANGE', 'values': [2000, 2000] },
      { 'propertyTypeId': 'FLAVOR', 'valuesRelation': 'SINGLE', 'values': ['DUCK'] }
    ]
  }
  const response = await request()
    .post('/api/pets')
    .send({ pet })
    .expect(200)

  const createdPet = response.body.data

  expect(createdPet.properties).toEqual(pet.properties)

  await deletePet(createdPet.id)
})

test('pets: create pet with invalid input - missing body', async () => {
  expect.assertions(1)
  try {
    await request().post('/api/pets')
  } catch (err) {
    expect(err.response.body.code).toBe('FAIL__INVALID_INPUT')
  }
})

test('pets: create pet with invalid input - missing pet', async () => {
  expect.assertions(2)
  try {
    await request()
      .post('/api/pets')
      .send({})
  } catch (err) {
    expect(err.response.body.code).toBe('FAIL__INVALID_INPUT')
    expect(err.response.body.message).toMatch('pet is missing')
  }
})

test('pets: create pet with invalid input - invalid pet - missing animal', async () => {
  expect.assertions(2)
  try {
    const pet = {
      'name': 'pet name'
    }
    await request()
      .post('/api/pets')
      .send({ pet })
  } catch (err) {
    expect(err.response.body.code).toBe('FAIL__INVALID_INPUT')
    expect(err.response.body.message).toMatch('invalid pet data provided')
  }
})

test('pets: create pet with invalid input - invalid pet - invalid animal', async () => {
  expect.assertions(2)
  try {
    const pet = {
      'name': 'pet name',
      'animal': 'DRAGON'
    }
    await request()
      .post('/api/pets')
      .send({ pet })
  } catch (err) {
    expect(err.response.body.code).toBe('FAIL__INVALID_INPUT')
    expect(err.response.body.message).toMatch('invalid pet data provided')
  }
})

test('pets: create pet with invalid input - invalid pet - missing race', async () => {
  expect.assertions(2)
  try {
    const pet = {
      'name': 'pet name',
      'animal': 'DOG'
    }
    await request()
      .post('/api/pets')
      .send({ pet })
  } catch (err) {
    expect(err.response.body.code).toBe('FAIL__INVALID_INPUT')
    expect(err.response.body.message).toMatch('invalid pet data provided')
  }
})

test('pets: create pet with invalid input - invalid properties - empty object', async () => {
  expect.assertions(2)
  try {
    const pet = {
      'name': 'pet name',
      'animal': 'DOG',
      'raceId': 1,
      'properties': [{}]
    }
    await request()
      .post('/api/pets')
      .send({ pet })
  } catch (err) {
    expect(err.response.body.code).toBe('FAIL__INVALID_INPUT')
    expect(err.response.body.message).toMatch('invalid properties data')
  }
})

test('pets: create pet with invalid input - invalid properties - invalid property format', async () => {
  expect.assertions(2)
  try {
    const pet = {
      'name': 'pet name',
      'animal': 'DOG',
      'raceId': 1,
      'properties': [
        { 'propertyTypeId': 'PET_WEIGHT', 'valuesRelation': 'RANGE', values: [50] } // missing 'to' of range
      ]
    }
    await request()
      .post('/api/pets')
      .send({ pet })
  } catch (err) {
    expect(err.response.body.code).toBe('FAIL__INVALID_INPUT')
    expect(err.response.body.message).toMatch('invalid property data')
  }
})

test('pets: get pet by id', async () => {
  const pet = {
    'animal': 'DOG',
    'name': 'pet name',
    'raceId': 2,
    'properties': []
  }
  const createdPet = await createPet(pet)

  const petResponse = await request()
    .get(`/api/pets/${createdPet.id}`)
    .expect(200)

  expect(petResponse.body.data).toMatchObject(pet)

  await deletePet(createdPet.id)
})

test('pets: get all pets - empty list', async () => {
  const response = await request()
    .get('/api/pets')
    .expect(200)

  expect(response.body.data).toEqual([])
})

test('pets: get all pets', async () => {
  const pet = {
    'animal': 'DOG',
    'name': 'pet name',
    'raceId': 2,
    'properties': []
  }
  const createdPet = await createPet(pet)

  const response = await request()
    .get('/api/pets')
    .expect(200)
  const responseData = response.body.data

  expect(responseData.length).toBe(1)
  const responsePet = responseData[0]
  expect(responsePet.name).toBe(pet.name)
  expect(responsePet.animal).toBe(pet.animal)
  expect(responsePet.raceId).toBe(pet.raceId)
  expect(responsePet.properties.length).toBe(0)

  await deletePet(createdPet.id)
})

test('pets: update pet', async () => {
  const pet = {
    'animal': 'DOG',
    'name': 'pet name',
    'raceId': 2,
    'properties': []
  }
  const createdPet = await createPet(pet)
  const updatePetData = {
    'id': createdPet.id,
    'animal': 'DOG',
    'name': 'new pet name',
    'raceId': 3,
    'properties': []
  }
  await request()
    .put(`/api/pets/${updatePetData.id}`)
    .send({ pet: updatePetData })
    .expect(200)

  const petAfterUpdate = await getPet(createdPet.id)
  expect(petAfterUpdate.name).toBe(updatePetData.name)
  expect(petAfterUpdate.raceId).toBe(updatePetData.raceId)

  await deletePet(createdPet.id)
})

test('pets: update pet with properties - dont preserve existing properties', async () => {
  const pet = {
    'animal': 'DOG',
    'name': 'pet name',
    'raceId': 2,
    'properties': [
      { 'propertyTypeId': 'FLAVOR', 'values': ['DUCK'], 'valuesRelation': 'SINGLE' }
    ]
  }
  const createdPet = await createPet(pet)

  const updatePetData = {
    'id': createdPet.id,
    'animal': 'DOG',
    'name': 'new pet name',
    'raceId': 3,
    'properties': [
      { 'propertyTypeId': 'PET_WEIGHT', 'values': [10], 'valuesRelation': 'SINGLE' }
    ]
  }
  await request()
    .put(`/api/pets/${updatePetData.id}`)
    .send({ pet: updatePetData })
    .expect(200)

  const petAfterUpdate = await getPet(createdPet.id)
  expect(petAfterUpdate.name).toBe(updatePetData.name)
  expect(petAfterUpdate.raceId).toBe(updatePetData.raceId)
  expect(petAfterUpdate.properties).toEqual(updatePetData.properties)

  await deletePet(createdPet.id)
})

test('pets: update pet with properties - preserve existing properties', async () => {
  const pet = {
    'animal': 'DOG',
    'name': 'pet name',
    'raceId': 2,
    'properties': [
      { 'propertyTypeId': 'FLAVOR', 'values': ['DUCK'], 'valuesRelation': 'SINGLE' }
    ]
  }
  const createdPet = await createPet(pet)

  const updatePetData = {
    'id': createdPet.id,
    'animal': 'DOG',
    'name': 'new pet name',
    'raceId': 3,
    'properties': [
      { 'propertyTypeId': 'PET_WEIGHT', 'values': [10], 'valuesRelation': 'SINGLE' }
    ]
  }
  await request()
    .put(`/api/pets/${updatePetData.id}`)
    .query({ 'preserve-properties': true })
    .send({ pet: updatePetData })
    .expect(200)

  const petAfterUpdate = await getPet(createdPet.id)
  expect(petAfterUpdate.name).toBe(updatePetData.name)
  expect(petAfterUpdate.raceId).toBe(updatePetData.raceId)
  expect(petAfterUpdate.properties.length).toBe(2)
  expect(petAfterUpdate.properties[0]).toEqual(pet.properties[0])
  expect(petAfterUpdate.properties[1]).toEqual(updatePetData.properties[0])

  await deletePet(createdPet.id)
})

test('pets: delete pet', async () => {
  const pet = {
    'animal': 'DOG',
    'name': 'pet name',
    'raceId': 2,
    'properties': []
  }
  const createdPet = await createPet(pet)
  await deletePet(createdPet.id)
    .expect(200)

  try {
    await getPet(createdPet.id)
  } catch (err) {
    expect(err.response.body.code).toBe('FAIL__PET_NOT_EXISTS')
  }
})

async function getPet (petId) {
  const res = await request()
    .get(`/api/pets/${petId}`)
    .send()
  return res.body.data
}

function deletePet (petId) {
  return request()
    .delete(`/api/pets/${petId}`)
    .send()
}

async function createPet (pet) {
  const response = await request()
    .post('/api/pets')
    .send({ pet })
  return response.body.data
}
