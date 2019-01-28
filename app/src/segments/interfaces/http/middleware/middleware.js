'use strict'

const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
<<<<<<< HEAD:app/src/segments/interfaces/http/middleware/middleware.js

module.exports = (app, cradle) => {
  const { logger } = cradle

  logger.info(`serving swagger docs at /docs`)
=======
const statusMonitor = require('express-status-monitor')
const expressWinston = require('express-winston')

const swaggerMiddleware = require('./swagger/swaggerMiddleware')
const authMiddleware = require('./auth-middleware')

module.exports = (app, cradle) => {
  const { config, logger } = cradle

  if (config.get('general.statusMonitor')) {
    app.use(statusMonitor({
      healthChecks: [{ path: '/api/health' }]
    }))
    logger.info(`serving status monitor at /status`)
  }

  if (config.get('general.swagger')) {
    app.use('/docs', swaggerMiddleware)
    logger.info(`serving swagger docs at /docs`)
  }

  if (config.get('logger.logExpress')) {
    expressWinston.requestWhitelist.push('body')
    expressWinston.responseWhitelist.push('body')
    app.use(expressWinston.logger({
      winstonInstance: logger,
      msg: 'HTTP    {{req.method}}     {{req.url}}    {{ req.body && JSON.stringify(req.body) !== "{}" ? "request body=[" + JSON.stringify(req.body) + "]" : "" }}'
    }))
  }
>>>>>>> 8be51c9974e593cc2b4ed3f31a7e1c92d84c99eb:app/src/interfaces/http/middleware/middleware.js

  app.use(compression())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cors())

  app.use(helmet())
}
