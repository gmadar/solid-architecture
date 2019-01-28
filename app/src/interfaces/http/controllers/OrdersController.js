const PromiseRouter = require('express-promise-router')
const { inject } = require('awilix-express')
const Status = require('http-status')
const _ = require('lodash')

const { success, fail } = require('../utils/httpResponses')
const codes = require('../utils/constants/response-codes')
const { secureRoute, roles: { admin } } = require('../utils/secureRoute')
const OrderMapper = require('../mappers/OrderMapper')
const parseBooleanQuery = require('../utils/parseBooleanQuery')

const OrdersController = {
  get router () {
    const router = PromiseRouter()

    router.get('/', secureRoute(), this.getAll)
    router.get('/last', secureRoute(), this.getLast)
    router.get('/:orderId', secureRoute(), this.getById)
    router.post('/', secureRoute(admin), this.create)
    router.post('/:orderId/begin-payment', secureRoute(), this.beginPayment)
    router.post('/:orderId/end-payment', secureRoute(), this.endPayment)
    router.post('/:orderId/shipment-details', secureRoute(), this.provideShipmentDetails)
    router.put('/:orderId', secureRoute(), this.update)
    router.delete('/:orderId', secureRoute(admin), this.delete)

    return router
  },

  getById: inject(({ getOrderById }) =>
    async (req, res) => {
      const { orderId } = req.params
      const includeDesiredProduct = parseBooleanQuery(req.query, 'include-desired-product')
      const includeSupplier = parseBooleanQuery(req.query, 'include-supplier')

      try {
        const order = await getOrderById(orderId, { includeDesiredProduct, includeSupplier })
        const clientResponse = OrderMapper.toClient(order)
        res.status(Status.OK).json(success(clientResponse))
      } catch (err) {
        const { ORDER_NOT_EXISTS } = getOrderById.codes
        if (err.isOperational) {
          if (err.code === ORDER_NOT_EXISTS) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.orders.orderNotExists, err.message))
          }
        }
        throw err
      }
    }
  ),

  getLast: inject(({ getLastOrder }) =>
    async (req, res) => {
      const includeDesiredProduct = parseBooleanQuery(req.query, 'include-desired-product')
      const includeSupplier = parseBooleanQuery(req.query, 'include-supplier')

      try {
        const order = await getLastOrder({ includeDesiredProduct, includeSupplier })
        const clientResponse = OrderMapper.toClient(order)
        res.status(Status.OK).json(success(clientResponse))
      } catch (err) {
        const { ORDER_NOT_EXISTS } = getLastOrder.codes
        if (err.isOperational) {
          if (err.code === ORDER_NOT_EXISTS) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.orders.orderNotExists, err.message))
          }
        }
        throw err
      }
    }
  ),

  getAll: inject(({ getAllOrders }) =>
    async (req, res) => {
      const groupId = req.query['group-id']
      const includeDesiredProduct =
        req.query['include-desired-product'] === 'true' || req.query['include-desired-product'] === ''

      const orders = await getAllOrders({ includeDesiredProduct, groupId })
      const clientResponse = orders.map(OrderMapper.toClient)
      res.status(Status.OK).json(success(clientResponse))
    }
  ),

  create: inject(({ createOrder }) =>
    async (req, res) => {
      const { order } = req.body
      if (_.isEmpty(order)) {
        return res.status(Status.BAD_REQUEST).json(fail(codes.general.invalidInput, 'order is missing in body.'))
      }

      try {
        const createdOrder = await createOrder(order)
        const clientResponse = OrderMapper.toClient(createdOrder)
        res.status(Status.OK).json(success(clientResponse))
      } catch (err) {
        const { INVALID_INPUT, ILLEGAL_STATE } = createOrder.codes
        if (err.isOperational) {
          if (err.code === INVALID_INPUT) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.general.invalidInput, err.message, err.data))
          }
        }
        if (err.code === ILLEGAL_STATE) {
          return res.status(Status.BAD_REQUEST)
            .json(fail(codes.orders.orderInIllegalState, err.message, err.data))
        }
        throw err
      }
    }
  ),

  delete: inject(({ deleteOrder }) =>
    async (req, res) => {
      const { orderId } = req.params

      try {
        await deleteOrder(orderId)
        res.status(Status.OK).json(success())
      } catch (err) {
        const { ORDER_NOT_EXISTS } = deleteOrder.codes
        if (err.isOperational) {
          if (err.code === ORDER_NOT_EXISTS) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.orders.orderNotExists, err.message))
          }
        }
        throw err
      }
    }
  ),

  update: inject(({ updateOrder }) =>
    async (req, res) => {
      const { order } = req.body
      const { orderId } = req.params
      if (_.isEmpty(order)) {
        return res.status(Status.BAD_REQUEST).json(fail(codes.general.invalidInput, 'order is missing in body.'))
      }
      order.id = _.toNumber(orderId)

      try {
        await updateOrder(order)
        res.status(Status.OK).json(success())
      } catch (err) {
        const { INVALID_INPUT, ILLEGAL_STATE, ORDER_NOT_EXISTS, UNAUTHORIZED } = updateOrder.codes
        if (err.isOperational) {
          if (err.code === INVALID_INPUT) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.general.invalidInput, err.message, err.data))
          }
          if (err.code === ORDER_NOT_EXISTS) {
            return res.status(Status.BAD_REQUEST)
              .json(fail(codes.orders.orderNotExists, err.message, err.data))
          }
          if (err.code === ILLEGAL_STATE) {
            return res.status(Status.BAD_REQUEST)
              .json(fail(codes.orders.orderInIllegalState, err.message, err.data))
          }
          if (err.code === UNAUTHORIZED) {
            return res.status(Status.BAD_REQUEST)
              .json(fail(codes.general.unauthorized, err.message, err.data))
          }
        }
        throw err
      }
    }
  ),

  beginPayment: inject(({ beginPayment }) =>
    async (req, res) => {
      const { orderId } = req.params
      const { endRedirectUrl } = req.body
      if (_.isEmpty(endRedirectUrl)) {
        return res.status(Status.BAD_REQUEST)
          .json(fail(codes.general.invalidInput, 'endRedirectUrl is missing in body.'))
      }

      try {
        const { beginRedirectUrl } = await beginPayment(orderId, endRedirectUrl)
        res.status(Status.OK).json(success({ beginRedirectUrl }))
      } catch (err) {
        throw err
      }
    }
  ),

  endPayment: inject(({ endPayment }) =>
    async (req, res) => {
      const { orderId } = req.params
      const { paymentId, customerId, documentNumber } = req.body
      if (_.isEmpty(paymentId) || _.isEmpty(customerId) || _.isEmpty(paymentId)) {
        return res.status(Status.BAD_REQUEST)
          .json(fail(codes.general.invalidInput, 'paymentId, customerId, documentNumber are required in body.'))
      }

      try {
        await endPayment({ orderId, paymentId, customerId, documentNumber })
        res.status(Status.OK).json(success())
      } catch (err) {
        const { INVALID_PAYMENT } = endPayment.codes
        if (err.isOperational) {
          if (err.code === INVALID_PAYMENT) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.orders.invalidPayment, err.message, err.data))
          }
        }
        throw err
      }
    }
  ),

  provideShipmentDetails: inject(({ provideShipmentDetails }) =>
    async (req, res) => {
      const { orderId } = req.params
      const { shipment } = req.body

      try {
        await provideShipmentDetails(orderId, shipment)
        res.status(Status.OK).json(success())
      } catch (err) {
        const { INVALID_INPUT, ORDER_NOT_EXISTS, ILLEGAL_STATE, UNAUTHORIZED } = provideShipmentDetails.codes
        if (err.isOperational) {
          if (err.code === INVALID_INPUT) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.general.invalidInput, err.message, err.data))
          }
          if (err.code === ORDER_NOT_EXISTS) {
            return res.status(Status.BAD_REQUEST)
              .json(fail(codes.orders.orderNotExists, err.message, err.data))
          }
          if (err.code === ILLEGAL_STATE) {
            return res.status(Status.BAD_REQUEST)
              .json(fail(codes.orders.orderInIllegalState, err.message, err.data))
          }
          if (err.code === UNAUTHORIZED) {
            return res.status(Status.BAD_REQUEST)
              .json(fail(codes.general.unauthorized, err.message, err.data))
          }
        }
        throw err
      }
    }
  )
}

module.exports = OrdersController
