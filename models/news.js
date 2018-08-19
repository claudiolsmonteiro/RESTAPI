const mongoose   = require('mongoose')
/**
 * Database Schema with the required fields (title, description, creation date and picture)
 */      
const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creationDate: {
        type : Date,
        default: Date.now
    },
    picture: { 
        type: String, 
        required: true
    }
}, { collection: 'news' })

//NewsSchema.plugin(timestamps)

module.exports = exports = mongoose.model('News', NewsSchema)