const getDesiredProducttFactory = require('../getDesiredProduct')

test('USE-CASE getDesiredProduct: get desired product', async () => {
  const mockDesiredProduct = { id: 'desired-product-id' }
  const desiredProductsRepository = {
    getById: jest.fn().mockResolvedValue(mockDesiredProduct)
  }
  const getDesiredProduct = getDesiredProducttFactory({ desiredProductsRepository })

  const desiredProduct = await getDesiredProduct(mockDesiredProduct.id)
  expect(desiredProductsRepository.getById).toBeCalledWith(mockDesiredProduct.id)
  expect(desiredProduct).toEqual(mockDesiredProduct)
})

test('USE-CASE getDesiredProduct: desired product not exists', async () => {
  const desiredProductsRepository = {
    getById: jest.fn().mockResolvedValue(null)
  }
  const getDesiredProduct = getDesiredProducttFactory({ desiredProductsRepository })

  const id = 'un-existent-id'
  const responsePromise = getDesiredProduct(id)
  await expect(responsePromise).rejects.toThrow(`desired product with id "${id}" not exists`)
})
