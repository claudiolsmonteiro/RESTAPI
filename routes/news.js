const news = require('../models/news')

module.exports = function(server) {

    /**
     * Create
     */
    server.post('/news', (req, res, next) => {

        let data = req.body || {}

        news.create(data)
            .then(task => {
                res.send(200, task)
                next()
            })
            .catch(err => {
                res.send(500, err)
            })

    })

    /**
     * List
     */
    server.get('/news', (req, res, next) => {

        let limit = parseInt(req.query.limit, 10) || 10, // default limit to 10 docs
            skip  = parseInt(req.query.skip, 10) || 0, // default skip to 0 docs
            query = req.query || {}

        // remove skip and limit from query to avoid false querying
        delete query.skip
        delete query.limit

        news.find(query).skip(skip).limit(limit)
            .then(news => {
                res.send(200, news)
                next()
            })
            .catch(err => {
                res.send(500, err)
            })

    })

    /**
     * Read
     */
    server.get('/news/:newsId', (req, res, next) => {

        news.findById(req.params.newsId)
            .then(news => {
                res.send(200, news)
                next()
            })
            .catch(err => {
                res.send(500, err)
            })

    })

    /**
     * Update
     */
    server.put('/news/:newsId', (req, res, next) => {

        let data = req.body || {},
            opts = {
                new: true
            }

        news.findByIdAndUpdate({ _id: req.params.newsId }, data, opts)
            .then(news => {
                res.send(200, news)
                next()
            })
            .catch(err => {
                res.send(500, err)
            })

    })

    /**
     * Delete
     */
    server.del('/news/:newsId', (req, res, next) => {

        const newsId = req.params.newsId

        news.findOneAndRemove({ _id: newsId })
            .then(() => {

                // remove associated todos to avoid orphaned data
                Todo.deleteMany({ _id: newsId })
                    .then(() => {
                        res.send(204)
                        next()
                    })
                    .catch(err => {
                        res.send(500, err)
                    })
            })
            .catch(err => {
                res.send(500, err)
            })

    })

}