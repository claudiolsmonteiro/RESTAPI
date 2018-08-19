/**
 * Module Dependencies
 */
const restify = require('restify'),
      mongoose = require('mongoose')

/**
 * Config
 */
const config = require('./config')

/**
 * Initialize Server
 */
const server = restify.createServer({
    name    : config.name,
    version : config.version
})

/**
 * Bundled Plugins (http://restify.com/#bundled-plugins)
 * JSON is false because form-data is used for image uploading
 * uploads directory is static so images can be observed (e.g. http://localhost:3000/download.jpeg)
 */

server.use(restify.plugins.jsonBodyParser({ mapParams: false }))
server.get('*', restify.plugins.serveStatic({
    directory: './uploads'
  }))
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({ mapParams: true }))
server.use(restify.plugins.fullResponse())


/**
 * Start Server, Connect to DB & Require Route Files
 */
server.listen(config.port, () => {

    /**
     * Connect to MongoDB via Mongoose
     */
    const opts = {
        promiseLibrary: global.Promise,
        server: {
            auto_reconnect: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000,
        },
        config: {
            autoIndex: true,
        },
    }

    mongoose.Promise = opts.promiseLibrary
    mongoose.connect(config.db.uri, opts)

    const db = mongoose.connection

    db.on('error', (err) => {
        if (err.message.code === 'ETIMEDOUT') {
            console.log(err)
            mongoose.connect(config.db.uri, opts)
        }
    })

    db.once('open', () => {

        require('./routes/news')(server)
        console.log(`Server is listening on port ${config.port}`)

    })

})
