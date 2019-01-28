const path = require('path')
const _ = require('lodash')
const { createContainer, asClass, asFunction, asValue } = require('awilix')
const { scopePerRequest } = require('awilix-express')

const config = require('./infrastructure/config')

const container = createContainer()

// System
container.register({
  config: asValue(config)
}).register({
  app: asClass(require('./application/Application')).singleton(),
  server: asClass(require('./interfaces/http/Server')).singleton()
}).register({
  router: asFunction(require('./interfaces/http/router')).singleton(),
  logger: asFunction(require('./infrastructure/logging/logger')).singleton()
}).register({
  currentUser: asValue(undefined)
})
// Middlewares
const errorHandler = config.get('general:debugMode')
  ? require('./interfaces/http/errors/debugErrorHandler')
  : require('./interfaces/http/errors/errorHandler')
container.register({
  containerMiddleware: asValue(scopePerRequest(container)),
  errorHandler: asValue(errorHandler)
})

// Repositories
//    by name convention use the last directory as registered name
container.loadModules(['src/infrastructure/database/repositories/**/*.js'],
  {
    formatName: (name, { path: filePath }) =>
      _.chain(
        path.dirname(filePath).split('/')
      )
        .last()
        .camelCase()
        .value()

  })

// Infrastructure
container.register({
  database: asFunction(require('./infrastructure/database/db')).singleton(),
  paymentService: asFunction(require('./infrastructure/payment-service/officeguy-payment-service')).singleton()
})

// Use Cases
container.loadModules(['src/application/use-cases/**/!(*.test).js'])

module.exports = container
