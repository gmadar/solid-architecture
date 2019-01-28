const estimatePriceFactory = require('../estimatePrice')

test('USE-CASE estimatePrice: missing product properties', async () => {
  const productsRepository = {}
  const estimatePrice = estimatePriceFactory({ productsRepository })

  productsRepository.getAll = jest.fn().mockResolvedValue([])

  const propertiesData = []
  const responsePromise = estimatePrice(propertiesData)
  await expect(responsePromise).rejects.toThrow('product properties are required')
})
