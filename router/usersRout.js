const express = require('express')
const router = express.Router()

const UsersController = require('../controllers/usersController')

router.get('/',UsersController.getCurrentUser)
router.post('/getUserDetails',UsersController.getUserDetails)
router.post('/signUpUsers',UsersController.signUpUsers)
router.post('/updateUsersDetails',UsersController.updateUsersDetails)
router.post('/deleteUser',UsersController.deleteUser)
router.post('/addProductsToAuction',UsersController.addProductsToAuction)
router.post('/biddingProducts',UsersController.biddingProducts)
router.get('/listAllItems',UsersController.listAllItems)
router.get('/listAllBids',UsersController.listAllBids)
router.get('/allBidsOfProduct',UsersController.allBidsOfProduct)
router.post('/winningBids',UsersController.winningBids)
router.post('/updateProductDetails',UsersController.updateProductDetails)

module.exports = router