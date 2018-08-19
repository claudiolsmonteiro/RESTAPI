'use strict'

module.exports = {
    name: 'rest-api',
    version: '0.0.1',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    db: {
        uri: 'mongodb://apiuser:apipassword@cluster0-shard-00-00-ppa1c.mongodb.net:27017,cluster0-shard-00-01-ppa1c.mongodb.net:27017,cluster0-shard-00-02-ppa1c.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
    }
}