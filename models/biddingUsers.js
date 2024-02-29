const mongoose = require('mongoose')
const Schema = mongoose.Schema

const biddingUsersSchema = new Schema({
    product_id: {
        type: String
    },
    user_email_id: {
        type: String
    },
    bidding_price: {
        type: Number
    },
    highest_bidder_price:{
        type: Number
    }
}, { timestamps: true })

const bidding_users = mongoose.model('bidding_users', biddingUsersSchema)
module.exports = bidding_users