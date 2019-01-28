const serializeError = require('serialize-error')
const logger = require('winston')

const config = require('../../../infrastructure/config')
const isDebugMode = !!config.get('general.debugMode')

/**
 * create response with jsend format
 * https://labs.omniti.com/labs/jsend
 */
module.exports = {
  error: function generateErrorResponse (code, message, data, debug) {
    logger.error(debug)
    return {
      status: 'error',
      code,
      message,
      debug: isDebugMode ? serializeError(debug) : undefined,
      data
    }
  },

  fail: function generateFailureResponse (code, message, data, debug) {
    return {
      status: 'fail',
      code,
      message,
      debug: isDebugMode ? serializeError(debug) : undefined,
      data
    }
  },

  success: function generateSuccessResponse (data) {
    return {
      status: 'success',
      data
    }
  }
}
