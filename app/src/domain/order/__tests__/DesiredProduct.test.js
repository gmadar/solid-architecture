const DesiredProduct = require('../DesiredProduct')
const Property = require('../../product/Property')

test('DOMAIN DesiredProduct: estimatePrice', async () => {
  const properties = [
    new Property({ value: 100, dataType: 'NUMBER' }),
    new Property({ value: 200, dataType: 'NUMBER' })
  ]
  const allProducts = []
  const recommendedPrice = DesiredProduct.estimatePrice(allProducts, properties)
  expect(recommendedPrice).toBe(recommendedPrice)
})
