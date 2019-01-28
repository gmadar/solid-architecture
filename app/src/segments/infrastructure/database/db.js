const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')

module.exports = ({ logger }) => {
  const db = {}
<<<<<<< HEAD:app/src/segments/infrastructure/database/db.js

  const host = 'localhost'
  const database = 'core'
  const port = 4306
  const user = 'root'
  const password = 'mamram'
  logger.log(`initializing db connection to address ${host}:${port} ...`)
=======
  const { host, port, user, password, database } = config.get('db')
  logger.info(`initializing db connection to address ${host}:${port} ...`)
>>>>>>> 8be51c9974e593cc2b4ed3f31a7e1c92d84c99eb:app/src/infrastructure/database/db.js
  // keep reference to the actual underlying sequelize object, in case we want to create transactions or test if connection is online
  // dynamically get all models
  db.sequelize = new Sequelize(database, user, password, {
    host: host,
    port: port,
    dialect: 'mysql',
    logging: (msg) => { if (config.get('logger.logSql')) logger.info(msg) },
    // disable string-based operators, and do not set any aliases (i.e. use the built-in Symbol-based operators
    operatorsAliases: false
  })

  fs.readdirSync(path.join(__dirname, 'models')).forEach(function (file) {
    const model = db.sequelize.import(path.join(__dirname, 'models', file))
    db[model.name] = model
  })

  // call each model's "associate" method
  //    explanation: we need to first create the models, and only then associate them. otherwise we would need to put all relationships in a single file to prevent cyclic reference
  Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db)
    }
  })

  return db
}
