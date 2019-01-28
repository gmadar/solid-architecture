const PromiseRouter = require('express-promise-router')
const { inject } = require('awilix-express')
const Status = require('http-status')

const { success } = require('../utils/httpResponses')

const GeoController = {
  get router () {
    const router = PromiseRouter()

    router.get('/cities', this.getAllCities)
    router.get('/areas', this.getAllAreas)

    return router
  },

  getAllCities: inject(({ getAllCities }) =>
    async (req, res, next) => {
      const cities = await getAllCities()

      res.status(Status.OK).json(success(cities))
    }
  ),

  getAllAreas: inject(({ getAllAreas }) =>
    async (req, res, next) => {
      const areas = await getAllAreas()

      res.status(Status.OK).json(success(areas))
    }
  )
}

module.exports = GeoController
