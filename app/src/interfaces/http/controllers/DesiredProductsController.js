const PromiseRouter = require('express-promise-router')
const { inject } = require('awilix-express')
const Status = require('http-status')
const _ = require('lodash')

const { success, fail } = require('../utils/httpResponses')
const { secureRoute } = require('../utils/secureRoute')
const codes = require('../utils/constants/response-codes')
const DesiredProductMapper = require('../mappers/DesiredProductMapper')
const PropertiesMapper = require('../mappers/PropertiesMapper')

const DesiredProductsController = {
  get router () {
    const router = PromiseRouter()

    router.post('/estimate-price', this.estimatePrice) // TODO: move to another controller
    router.put('/:id', secureRoute(), this.update) // TODO: move to order controller under /order/:id:/desired-product

    return router
  },

  update: inject(({ updateDesiredProduct }) =>
    async (req, res) => {
      const { desiredProduct } = req.body
      const { id } = req.params
      if (_.isEmpty(desiredProduct)) {
        return res.status(Status.BAD_REQUEST)
          .json(fail(codes.general.invalidInput, 'desired product is missing in body.'))
      }
      desiredProduct.id = _.toNumber(id)

      let desiredProductAsDomain
      if (desiredProduct) {
        try {
          desiredProductAsDomain = DesiredProductMapper.fromClient(desiredProduct)
        } catch (err) {
          return res.status(Status.BAD_REQUEST).json(fail(codes.general.invalidInput, err.message))
        }
      }

      try {
        await updateDesiredProduct(desiredProductAsDomain)
        res.status(Status.OK).json(success())
      } catch (err) {
        const { INVALID_INPUT, DESIRED_PRODUCT_NOT_EXISTS } = updateDesiredProduct.codes
        if (err.isOperational) {
          if (err.code === INVALID_INPUT) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.general.invalidInput, err.message, err.data))
          }
          if (err.code === DESIRED_PRODUCT_NOT_EXISTS) {
            return res.status(Status.BAD_REQUEST)
              .json(fail(codes.desiredProducts.desiredProductNotExists, err.message, err.data))
          }
        }
        throw err
      }
    }
  ),

  estimatePrice: inject(({ estimatePrice }) =>
    async (req, res) => {
      const { properties } = req.body
      if (_.isEmpty(req.body)) {
        return res.status(Status.BAD_REQUEST)
          .json(fail(codes.general.invalidInput, 'body is required'))
      }
      if (_.isEmpty(properties)) {
        return res.status(Status.BAD_REQUEST)
          .json(fail(codes.general.invalidInput, 'product properties required'))
      }

      let propertiesDomain
      try {
        propertiesDomain = PropertiesMapper.fromClient(properties)
      } catch (err) {
        return res.status(Status.BAD_REQUEST).json(fail(codes.general.invalidInput, err.message))
      }

      const price = await estimatePrice(propertiesDomain)
      res.status(Status.OK).json(success(price))
    }
  )
}

module.exports = DesiredProductsController
