class Application {
  constructor ({ server, database, logger }) {
    this.server = server
    this.database = database
    this.logger = logger
  }

  async start () {
    this.logger.info('starting core backend ...')
    this.logger.info(`config: ${JSON.stringify(this.config)}`)
    this.logger.info(`env variables: ${JSON.stringify(process.env)}`)
    await this.database.sequelize.authenticate()
    await this.server.start()
  }
}

module.exports = Application
