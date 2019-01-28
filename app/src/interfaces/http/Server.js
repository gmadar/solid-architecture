const express = require('express')
const http = require('http')
const https = require('https')
const fs = require('fs')
const mustacheExpress = require('mustache-express')

class Server {
  constructor ({ config, router, logger }) {
    this.config = config
    this.logger = logger
    this.express = express()

    this.express.use(router)
  }

  start () {
    return new Promise((resolve) => {
      const useDevSSL = this.config.get('server.devSsl')
      let server
      if (useDevSSL) {
        // create https server with development certificate for local HTTPS
        const credentials = {
          key: fs.readFileSync('ssl/server.key'),
          cert: fs.readFileSync('ssl/server.crt')
        }
        server = https.createServer(credentials, this.express)
      } else {
        server = http.createServer(this.express)
      }

      // listen on provided port, on all network interfaces.
      const port = this.config.get('server.port')
      server.listen(port)
      server.on('error', this.onError.bind(this))
      server.on('listening', () => {
        const addr = server.address()
        const bind = typeof addr === 'string'
          ? 'pipe ' + addr
          : 'port ' + addr.port
        this.logger.info(`Listening at ${bind} ${useDevSSL ? '[using dev SSL for HTTPS]' : ''}`)
        resolve()
      })

      this.express.engine('html', mustacheExpress())
      this.express.set('view engine', 'mustache')
      this.express.set('views', 'src/public/views')
    })
  }

  // event listener for HTTP server "error" event.
  onError (error) {
    if (error.syscall !== 'listen') {
      throw error
    }

    const port = this.config.get('server.port')
    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges')
        process.exit(1)
      case 'EADDRINUSE':
        console.error(bind + ' is already in use')
        process.exit(1)
      default:
        throw error
    }
  }
}

module.exports = Server
