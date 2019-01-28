const updateDesiredProductFactory = require('../updateDesiredProduct')

test('USE-CASE updateDesiredProduct: existing fields and new fields are merged', async () => {
  const existingDesiredProduct = {
    toJSON: () => ({
      id: 123,
      properties: []
    })
  }
  const desiredProductsRepository = {
    getById: jest.fn().mockResolvedValue(existingDesiredProduct),
    update: jest.fn().mockResolvedValue()
  }
  const currentUser = { id: 0 }
  const updateDesiredProduct = updateDesiredProductFactory({ desiredProductsRepository, currentUser })

  const desiredProductData = { id: 123, existingProductId: 1 }
  await updateDesiredProduct(desiredProductData)

  expect(desiredProductsRepository.update).toBeCalledWith(
    expect.objectContaining(
      {
        id: 123,
        existingProductId: 1, // the only field updated
        properties: []
      }
    ))
})

test('USE-CASE updateDesiredProduct: updated desired product is returned', async () => {
  const existingDesiredProduct = {
    toJSON: () => ({ id: 'desired-product-id' })
  }
  const mockUpdatedDesiredProduct = { id: 'desired-product-id' }
  const desiredProductsRepository = {
    getById: jest.fn().mockResolvedValue(existingDesiredProduct),
    update: jest.fn().mockResolvedValue(mockUpdatedDesiredProduct)
  }
  const currentUser = { id: 0 }
  const updateDesiredProduct = updateDesiredProductFactory({ desiredProductsRepository, currentUser })

  const desiredProductData = { id: 123, properties: [] }
  const response = await updateDesiredProduct(desiredProductData)

  expect(response).toBe(mockUpdatedDesiredProduct)
})

test('USE-CASE updateDesiredProduct: invalid desired product', async () => {
  const mockDesiredProduct = {
    toJSON: () => ({ id: 'desired-product-id' })
  }
  const desiredProductsRepository = {
    getById: jest.fn().mockResolvedValue(mockDesiredProduct),
    update: jest.fn().mockResolvedValue(mockDesiredProduct)
  }
  const currentUser = { id: 0 }
  const updateDesiredProduct = updateDesiredProductFactory({ desiredProductsRepository, currentUser })

  const desiredProductData = { id: 123, properties: [], baseDesiredProductId: 'string' } // id should be numeric
  const responsePromise = updateDesiredProduct(desiredProductData)

  await expect(responsePromise).rejects.toThrow('invalid desired product data provided')
})
