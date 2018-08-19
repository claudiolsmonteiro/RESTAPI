const news = require('../models/news'),
      multer = require('multer'),
      fs = require('fs')

/**
 * Defines the storage folder for the pictures uploaded
 */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

/**
 * Only accepts files that are either in jpeg or png format
 */
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === "image/png") {
        cb(null, true)
    }
    else {
        cb(new Error('Invalid file type. File type must be either jpeg or png!'), false)
    }
}
/**
 * Upload method of multer with a maximum file size of 5mb
 */
const upload = multer({
    storage: storage, 
    limit: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter 
})

module.exports = function(server) {

    /**
     * Inserts news with the fields: title, description, date and picture
     */
    server.post('/news', upload.single('newsImage'), (req, res, next) => {
        let data = req.body || {}
        data.picture= req.file.path

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
     * Returns all available news
     */
    server.get('/news', (req, res, next) => {

            let skip  = parseInt(req.query.skip, 10) || 0, // default skip to 0 items
            query = req.query || {}

        // remove skip from query to avoid false querying
        delete query.skip

        news.find(query).skip(skip)
            .then(news => {
                res.send(200, news)
                next()
            })
            .catch(err => {
                res.send(500, err)
            })

    })

    /**
     * Returns a specific news item
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
     * Finds the entry associated with the given id and updates it with the new values
     */
    server.put('/news/:newsId', upload.single('newsImage'), (req, res, next) => {

        let data = req.body || {},
            opts = {
                new: true
            }
        if(req.file != undefined) {
            data.picture= req.file.path
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
     * Deletes a news item and associated image
     */
    server.del('/news/:newsId', (req, res, next) => {

        const newsId = req.params.newsId

        /**
         * Queries the database first to find and delete the picture associated with the news being deleted
         */
        news.findById(req.params.newsId)
            .then(news => {
                fs.unlink(news.picture, (err) => {
                    if (err) throw err;
                    console.log(news.picture + " was deleted.");
                  })
                next()
            })
            .catch(err => {
                res.send(500, err)
            })

        /**
         * Deletes the database entry associated with the given id
         */
        news.findOneAndDelete({ _id: newsId })
            .then(() => {
                res.send(204)
                next()
            })
            .catch(err => {
                res.send(500, err)
            })
    })
}
