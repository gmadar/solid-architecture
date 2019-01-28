const request = require('supertest')

const getMockedApp = require('./getMockedApp')

const controllerPath = '../DesiredProductsController'

jest.mock('../../../../infrastructure/config', () => ({
  get: () => undefined
}))

test('CONTROLLER ProductsController: estimate-price - invalid input - empty object', async () => {
  expect.assertions(1)
  try {
    await request(getMockedApp(controllerPath, {}))
      .post('/estimate-price')
      .send({})
      .set('Accept', 'application/json')
  } catch (err) {
    expect(err.response.body.code).toBe('FAIL__INVALID_INPUT')
  }
})

test('CONTROLLER ProductsController: estimate-price - valid input', async () => {
  const mockPrice = { price: 300, unit: 'PER_KG' }
  const mockContainer = {
    estimatePrice: () => mockPrice
  }

  const response = await request(getMockedApp(controllerPath, mockContainer))
    .post('/estimate-price')
    .send({ properties: [{ 'propertyTypeId': 'DOG_WEIGHT', 'valuesRelation': 'RANGE', 'values': [2000, 2000] }] })
    .set('Accept', 'application/json')
    .expect(200)
  expect(response.body.data).toEqual(mockPrice)
})
