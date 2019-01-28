const createRequest = require('../utils/request')

let request, destroyUser
beforeAll(async () => {
  ({ request, destroyUser } = await createRequest())
})

afterAll(() => {
  return destroyUser()
})

test('geo: get all cities', async () => {
  const response = await request({ unAuthenticated: true })
    .get('/api/geo/cities')
    .expect(200)

  const cities = response.body.data

  expect(cities.length).toBeGreaterThan(0)
  expect(cities[0].id).not.toBeUndefined()
  expect(cities[0].name).not.toBeUndefined()
  expect(cities[0].areaId).not.toBeUndefined()
})

test('geo: get all areas', async () => {
  const response = await request({ unAuthenticated: true })
    .get('/api/geo/areas')
    .expect(200)

  const areas = response.body.data

  expect(areas.length).toBeGreaterThan(0)
  expect(areas[0].id).not.toBeUndefined()
  expect(areas[0].name).not.toBeUndefined()
})
