const winston = require('winston')
const { combine, timestamp, colorize, printf, prettyPrint } = winston.format

// TODO: add rotation file
//require('winston-daily-rotate-file')
// const fs = require('fs')
// const path = require('path')

<<<<<<< HEAD:app/src/segments/infrastructure/logging/logger.js
module.exports = () => {
  logger.level = 'DEBUG'
  const filename = 'log'
  if (filename) {
    // create directory on filesystem if not exists
    const fileDirPath = path.dirname(filename)
    if (!fs.existsSync(fileDirPath)) {
      fs.mkdirSync(fileDirPath)
    }
=======
module.exports = ({ config }) => {
  // logger.level = config.get('logger.level')
  // const filename = config.get('logger.filename')
  // if (filename) {
  //   // create directory on filesystem if not exists
  //   const fileDirPath = path.dirname(filename)
  //   if (!fs.existsSync(fileDirPath)) {
  //     fs.mkdirSync(fileDirPath)
  //   }
  //
  //   logger.add(logger.transports.DailyRotateFile, {
  //     filename: filename,
  //     prepend: true,
  //     handleExceptions: true,
  //     humanReadableUnhandledException: true
  //   })
  // }
>>>>>>> 8be51c9974e593cc2b4ed3f31a7e1c92d84c99eb:app/src/infrastructure/logging/logger.js

  const logger = winston.createLogger({
    level: config.get('logger.level'),
    transports: [
      new winston.transports.Console()
    ],
    format: combine(
      colorize(),
      timestamp(),
      printf(({ level, message, timestamp }) => `${timestamp} ${level}:   ${message}`),
    )
  })

  return logger
}
