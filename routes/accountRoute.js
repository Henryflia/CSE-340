// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index.js")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to Register
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )
  router.post(
    "/login",
    regValidate.LoginRules(),
    regValidate.checkLoginData,
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router;