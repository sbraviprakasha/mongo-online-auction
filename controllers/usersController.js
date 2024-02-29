const { response } = require('express')
const { v4: uuidv4 } = require('uuid');
const users = require('../models/users')
const products = require('../models/products')
const biddingUsers = require('../models/biddingUsers')

const checkEmptyField = (event) => {
    let checkEmptyFields = true;
    for (const field in event) {
        if (typeof event[field] === 'string') {
            if (event[field].trim().length === 0) {
                checkEmptyFields = false;
            } else {
                event[field] = event[field].trim();
            }
        } else if (Array.isArray(event[field]) && event[field].length === 0) {
            checkEmptyFields = false;
        }
    }
    return checkEmptyFields;
};

const getCurrentUser = (req, res, next) => {
    users.find()
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: "An error occured!"
            })
        })
}

const listAllItems = async (req, res, next) => {
    try {
        const allItems = await products.find({}, {
            product_name: 1,
            product_id: 1,
            product_status: 1,
            bids_place: 1,
            product_minimum_price: 1,
            highest_bidder_price: 1,
            createdAt: 1,
            _id: 0
        });

        res.json({
            status: "success",
            response: allItems
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error occurred while listing all items."
        });
    }
};

const listAllBids = async (req, res, next) => {
    try {
        const allBids = await biddingUsers.find({}, {
            _id: 0,
            product_id: 1,
            user_email_id: 1,
            bidding_price: 1,
            highest_bidder_price: 1
        });
        res.json({
            status: "success",
            response: allBids
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error occurred while listing all bids."
        });
    }
};

const allBidsOfProduct = async (req, res, next) => {
    try {
        if (!req.body.product_id) {
            throw new Error("Product ID is required.");
        }

        const bidders = await biddingUsers.find({ product_id: req.body.product_id }, {
            _id: 0,
            product_id: 1,
            user_email_id: 1,
            bidding_price: 1,
            highest_bidder_price: 1,
            createdAt: 1
        });
        if (bidders.length > 0) {
            res.json({
                status: "Success",
                response: bidders
            });
        } else {
            res.json({
                status: "error",
                message: "Oops! It seems that no one is currently bidding on this product. Please ensure you have entered a valid product ID."
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
};

const getUserDetails = (req, res, next) => {
    users.findById(req.body.userID)
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: 'An error Occured!'
            })
        })
}

const signUpUsers = async (req, res, next) => {
    try {
        let existingUser = await users.findOne({ user_email_id: req.body.user_email_id });
        if (existingUser) {
            throw new Error("Oops! It seems that this user already exists.");
        }
        let newUser = new users({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            user_full_name: req.body.user_full_name ? req.body.user_full_name : req.body.first_name + " " + req.body.last_name,
            user_email_id: req.body.user_email_id,
            user_phone_number: req.body.user_phone_number,
            user_status: "Active"
        });
        await newUser.save();
        res.json({
            status: "success",
            message: "Congratulations! You've successfully signed up as a new user!"
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
};

const addProductsToAuction = async (req, res, next) => {
    try {
        if (checkEmptyField(req.body)) {
            let user = await users.findOne({ user_email_id: req.body.user_email_id });
            if (user) {
                let newProduct = new products({
                    product_id: uuidv4(),
                    user_email_id: user.user_email_id,
                    product_name: req.body.product_name,
                    bids_place: req.body.bids_place,
                    product_status: "Bidding started",
                    product_minimum_price: req.body.product_minimum_price
                });
                await newProduct.save();
                res.json({
                    status: "success",
                    message: "Your product have been successfully added to the auctions!"
                });
            } else {
                throw new Error("Oops! It appears that this user does not exist. Please double-check the user email id or sign up to create a new account.");
            }
        } else {
            throw new Error("Oops! It seems there was an empty field. Please ensure all necessary information is provided before adding products to the auction.");
        }
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
};

const biddingProducts = async (req, res, next) => {
    try {
        if (checkEmptyField(req.body)) {
            let user = await users.findOne({ user_email_id: req.body.user_email_id });
            if (user) {
                let product = await products.findOne({ product_id: req.body.product_id });
                if (product) {
                    let newBidding = new biddingUsers({
                        product_id: product.product_id,
                        bidding_price: req.body.bidding_price,
                        user_email_id: user.user_email_id
                    });
                    await newBidding.save();
                    res.json({
                        status: "Success",
                        status_message: "Success! The bidding price for the product has been successfully added."
                    });
                } else {
                    throw new Error("We couldn't find any data for the product with ID: " + req.body.product_id + ". Please verify the product ID and try again.");
                }
            } else {
                throw new Error("Oops! User not found. Please double-check the email_id provided.");
            }
        } else {
            throw new Error("Oops! It seems there was an empty field. Please ensure all necessary information is provided before adding bidding price to the product.");
        }
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
};

const updateUsersDetails = async (req, res, next) => {
    try {
        let existingUser = await users.findOne({ user_email_id: req.body.user_email_id });
        if (existingUser) {
            let updatedData = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                user_full_name: req.body.user_full_name ? req.body.user_full_name : req.body.first_name + " " + req.body.last_name,
                user_phone_number: req.body.user_phone_number,
                user_status: req.body.user_status
            };
            await users.findByIdAndUpdate(existingUser._id, { $set: updatedData });
            res.json({
                status: "success",
                message: "Great news! User details have been successfully updated!"
            });
        }

        throw new Error("Oops! User not found. Please double-check the email_id provided.");
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "An error occurred while updating user details."
        });
    }
};

const winningBids = async (req, res) => {
    try {
        if (!req.body.product_id) {
            throw new Error("Product ID is required.");
        }
        const bidders = await biddingUsers.find({ product_id: req.body.product_id });

        if (bidders.length > 0) {
            const biddingPrices = bidders.map(bidder => bidder.bidding_price);
            const higherBidderPrice = Math.max(...biddingPrices);
            const productDetails = await products.findOne({ product_id: req.body.product_id });
            const biddingDetails = await biddingUsers.findOne({ product_id: req.body.product_id });
            await products.updateOne(
                { product_id: productDetails.product_id },
                {
                    $set: {
                        highest_bidder_price: higherBidderPrice,
                        product_status: "sold"
                    }
                }
            );
            await biddingUsers.updateOne(
                { product_id: biddingDetails.product_id },
                {
                    $set: {
                        highest_bidder_price: higherBidderPrice
                    }
                }
            );
            res.json({
                status: "success",
                status_message: "Fantastic! The higher bidder price has been successfully updated. Happy bidding!"
            });
        } else {
            res.json({
                status_message: "Oops! It seems that no one is currently bidding on this product. Please ensure you have entered a valid product ID."
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        if (!req.body.user_email_id) {
            throw new Error("User email ID is required.");
        }
        const user = await users.findOne({ user_email_id: req.body.user_email_id });

        if (user) {
            await biddingUsers.deleteMany({ user_email_id: user.user_email_id });
            await products.deleteMany({ user_email_id: user.user_email_id });
            await users.deleteOne({ user_email_id: user.user_email_id });
            return res.json({
                status: "success",
                status_message: "User successfully deleted!",
            });
        } else {
            throw new Error('User Not Found!');
        }
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
};

const updateProductDetails = async (req, res) => {
    try {
        if (!req.body.user_email_id || !req.body.product_id) {
            throw new Error("User email ID and product ID are required.");
        }
        const user = await users.findOne({ user_email_id: req.body.user_email_id });
        if (user) {
            const productDetails = await products.findOne({ product_id: req.body.product_id });
            if (productDetails) {
                const updatedProductDetails = {
                    product_minimum_price: req.body.product_minimum_price,
                    bids_place: req.body.bids_place,
                    product_status: req.body.product_status
                };
                await products.updateOne({ product_id: req.body.product_id }, { $set: updatedProductDetails });

                return res.json({
                    status: "SUCCESS",
                    status_message: "Success! The product details have been successfully updated."
                });
            } else {
                throw new Error("We couldn't find any data for the product with ID: " + req.body.product_id + ". Please verify the product ID and try again.");
            }
        } else {
            throw new Error("Oops! User not found. Please double-check the email_id provided.");
        }
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
};

module.exports = {
    getCurrentUser, getUserDetails, signUpUsers, updateUsersDetails, deleteUser, addProductsToAuction, biddingProducts, listAllItems, listAllBids, allBidsOfProduct, winningBids, updateProductDetails
}