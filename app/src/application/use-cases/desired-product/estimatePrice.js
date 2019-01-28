const DesiredProduct = require('../../../domain/order/DesiredProduct')
const Property = require('../../../domain/product/Property')
const OperationalError = require('../../../utils/OperationalError')

const codes = {
  INVALID_INPUT: 'INVALID_INPUT'
}

module.exports = ({ productsRepository }) => {
  const res = async function estimatePrice (propertiesData) {
    if (!propertiesData || !propertiesData.length) {
      throw new OperationalError(codes.INVALID_INPUT, 'product properties are required')
    }

    const properties = propertiesData.map(currItem => {
      const property = new Property(currItem)
      const { valid, errors } = property.validate()
      if (!valid) {
        throw new OperationalError(codes.INVALID_INPUT, 'invalid property data provided', errors)
      }
      return property
    })

    const allProducts = await productsRepository.getAll()
    const { price, relevantProductIds } = DesiredProduct.estimatePrice(allProducts, properties)

    const estimation = {
      relevantProductIds,
      bestPrice: price * 0.7,
      worstPrice: price * 0.9
    }
    return estimation
  }
  res.codes = codes
  return res
}
