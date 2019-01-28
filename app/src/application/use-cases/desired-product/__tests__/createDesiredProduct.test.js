const createDesiredProductFactory = require('../createDesiredProduct')

test('USE-CASE createDesiredProduct: valid desired product', async () => {
  const mockDesiredProduct = { id: 'desired-product-id' }
  const desiredProductsRepository = {
    create: jest.fn().mockResolvedValue(mockDesiredProduct)
  }
  const currentUser = { id: 0 }
  const createDesiredProduct = createDesiredProductFactory({ desiredProductsRepository, currentUser })

  const desiredProductData = { properties: [] }
  const response = await createDesiredProduct(desiredProductData)

  expect(response).toBe(mockDesiredProduct)
})

test('USE-CASE createDesiredProduct: invalid desired product', async () => {
  const mockDesiredProduct = { id: 123 }
  const desiredProductsRepository = {
    create: jest.fn().mockResolvedValue(mockDesiredProduct)
  }
  const currentUser = { id: 0 }
  const createDesiredProduct = createDesiredProductFactory({ desiredProductsRepository, currentUser })

  const desiredProductData = { properties: [], baseDesiredProductId: 'string' } // id should be numeric
  const responsePromise = createDesiredProduct(desiredProductData)

  await expect(responsePromise).rejects.toThrow('invalid desired product data provided')
})
