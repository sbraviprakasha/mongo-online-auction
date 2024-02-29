const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    user_full_name: {
        type: String
    },
    user_email_id: {
        type: String
    },
    user_phone_number: {
        type: String
    },
    user_status: {
        type: String
    }
}, { timestamps: true })

const auction_users = mongoose.model('auction_users', usersSchema)
module.exports = auction_users
