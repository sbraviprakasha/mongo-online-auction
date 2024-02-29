const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productsSchema = new Schema({
    product_id: {
        type: String
    },
    user_email_id: {
        type: String
    },
    product_name: {
        type: String
    },
    bids_place: {
        type: String
    },
    product_status: {
        type: String
    },
    product_minimum_price: {
        type: Number
    },
    highest_bidder_price: {
        type: Number
    }
}, { timestamps: true })

const auction_products = mongoose.model('auction_products', productsSchema)
module.exports = auction_products