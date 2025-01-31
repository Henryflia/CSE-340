// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index.js")
const accountController = require("../controllers/accountController")


// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to Register
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;