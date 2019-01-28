const ProductMapper = require('../../mappers/ProductMapper')
const PropertyValueOptionMapper = require('../../mappers/PropertyValueOptionMapper')

class SequelizeProductsRepository {
  constructor ({ database }) {
    this.ProductModel = database.Product
    this.ProductPriceModel = database.ProductPrice
    this.PropertyValueModel = database.PropertyValue
    this.PropertyValueOptionModel = database.PropertyValueOption
  }

  async create (product) {
    const productAsDb = ProductMapper.toDatabase(product)

    const include = []
    if (product.properties && product.properties.length) {
      include.push({ model: this.PropertyValueModel })
    }

    const createdProduct = await this.ProductModel.create(productAsDb, { include })
    return ProductMapper.toDomain(createdProduct)
  }

  async getAll ({ includePrices = true } = {}) {
    const include = [
      { model: this.PropertyValueModel, include: [{ all: true, nested: true }] }
    ]
    if (includePrices) {
      include.push(this.ProductPriceModel)
    }

    const products = await this.ProductModel.findAll({ include })
    return products.map(ProductMapper.toDomain)
  }

  async getById (productId, { includePrices = true } = {}) {
    const include = [
      { model: this.PropertyValueModel, include: [{ all: true, nested: true }] }
    ]
    if (includePrices) {
      include.push(this.ProductPriceModel)
    }

    const product = await this.ProductModel.findByPk(productId, { include })
    if (!product) return null

    return ProductMapper.toDomain(product)
  }

  async deleteById (productId) {
    const deletedRecords = await this.ProductModel.destroy({ where: { productId } })
    if (deletedRecords === 0) {
      // TODO: throw operational error
      throw new Error(`could not find a product with id "${productId}"`)
    }
  }

  async getAllPropertyValueOptions () {
    const options = await this.PropertyValueOptionModel.findAll()
    return options.map(PropertyValueOptionMapper.toDomain)
  }
}

module.exports = SequelizeProductsRepository
