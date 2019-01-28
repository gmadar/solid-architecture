const _ = require('lodash')

// load env variables from .env files
require('dotenv-flow').config()

// TODO: write helper func to get val from env + throw error if required and missing

const config = {
  'general': {
    'debugMode': process.env.DEBUG_MODE || true,
    'statusMonitor': process.env.STATUS_MONITOR || true,
    'swagger': process.env.SWAGGER || false
  },
  'server': {
    'port': process.env.PORT || 7001,
    'backendUrl': process.env.BACKEND_URL,
    'devSsl': process.env.DEV_SSL || false
  },
  'logger': {
    'level': process.env.LOGGER_LEVEL || 'debug',
    'filename': process.env.LOGGER_FILENAME || false, // "./logs/backend.log",
    'logSql': process.env.LOGGER_SQL || true,
    'logExpress': process.env.LOGGER_EXPRESS || true
  },
  'db': {
    'host': process.env.DB_HOST,
    'port': process.env.DB_PORT,
    'user': process.env.DB_USER,
    'password': process.env.DB_PASSWORD,
    'database': process.env.DB_DATABASE || 'core'
  },
  'authentication': {
    'token': {
      'secret': process.env.JWT_SECRET || 'l1ran1sHeRe4G00d',
      'issuer': process.env.JWT_ISSUER || 'backend-api'
    },
    'facebook': {
      'clientId': process.env.FACEBOOK_CLIENT_ID || '492941227887917',
      'clientSecret': process.env.FACEBOOK_CLIENT_SECRET || '45ea3e7430078a7fe1c569173e1201b9'
    },
    'google': {
      'clientId': process.env.GOOGLE_CLIENT_ID ||
      '716855244325-jsh8ha3jhuocph48dqa0qku65qgd4r1b.apps.googleusercontent.com',
      'clientSecret': process.env.GOOGLE_CLIENT_SECRET || '-HUxjg7DU0_0pD_fLXX-Pldt'
    }
  },
  'payment': {
    'companyId': '30896855',
    'apiKey': 'KNx7ddabbsQseZ0ToMIGnUoetTOWDSZ08K0Sx4LqI4N89F5Rps',
    'sendUpdateByEmailAddress': process.env.PAYMENT_UPDATES_EMAIL || 'liran@petingo.co.il' // TODO: change to alon
  }
}

module.exports = {
  get: (key) => {
    const value = _.get(config, key)
    if (value === 'true') return true
    if (value === 'false') return false
    return value
  },
  ...config
}
