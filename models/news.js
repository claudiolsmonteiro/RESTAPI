const mongoose   = require('mongoose'),
      timestamps = require('mongoose-timestamp')

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { collection: 'news' })

NewsSchema.plugin(timestamps)

module.exports = exports = mongoose.model('News', NewsSchema)