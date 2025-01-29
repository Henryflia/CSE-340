// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index.js")
const accountController = require("../controllers/accountController")


// Route to build inventory by classification view
router.get("../login", utilities.handleErrors(accountController.buildLogin));
module.exports = router;