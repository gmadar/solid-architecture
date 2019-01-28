const PromiseRouter = require('express-promise-router')
const { inject } = require('awilix-express')
const Status = require('http-status')

const PropertiesMapper = require('../mappers/PropertiesMapper')
const { success } = require('../utils/httpResponses')

const ProductsController = {
  get router () {
    const router = PromiseRouter()

    router.get('/property-value-options', this.getAllPropertyValueOptions)
    router.get('/', this.getAllProducts)

    return router
  },

  getAllProducts: inject(({ getAllProducts }) =>
    async (req, res) => {
      let products = await getAllProducts()

      const clientResponse = []
      for (let product of products) {
        clientResponse.push({
          ...product.toJSON(),
          properties: PropertiesMapper.toClient(product.properties)
        })
      }

      res.status(Status.OK).json(success(clientResponse))
    }
  ),

  getAllPropertyValueOptions: inject(({ getAllPropertyValueOptions }) =>
    async (req, res) => {
      const options = await getAllPropertyValueOptions()
      res.status(Status.OK).json(success(options))
    }
  )
}

module.exports = ProductsController
