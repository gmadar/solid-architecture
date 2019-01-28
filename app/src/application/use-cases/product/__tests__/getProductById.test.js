const getProductByIdFactory = require('../getProductById')

test('USE-CASE getProductById: product not exists', async () => {
  const productsRepository = {
    getById: jest.fn().mockResolvedValue(null)
  }
  const getProductById = getProductByIdFactory({ productsRepository })

  const productId = 'un-existent-id'
  await expect(
    getProductById(productId)
  ).rejects.toMatchObject({ code: getProductById.codes.PRODUCT_NOT_EXISTS })
})

test('USE-CASE getProductById: gets a product', async () => {
  const mockProduct = { id: 'product-id' }
  const productsRepository = {
    getById: jest.fn().mockResolvedValue(mockProduct)
  }
  const getProductById = getProductByIdFactory({ productsRepository })

  const productId = 'product-id'
  const response = await getProductById(productId)
  expect(response.id).toEqual(productId)
})
