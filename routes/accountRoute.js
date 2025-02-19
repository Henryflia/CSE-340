// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index.js")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

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
    utilities.handleErrors(accountController.accountLogin)
  )

  router.get("/update/:accountId", utilities.handleErrors(accountController.buildUpdate))
  
  // Logoute route
  router.get("/logout", utilities.handleErrors(accountController.accountLogout))

// Process the registration data
router.post(
    "/update",
    regValidate.updateRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
  )

  router.post(
    "/update-password",
    regValidate.updatePasswordRules(),
    regValidate.checkUpdatePasswordData,
    utilities.handleErrors(accountController.updatePassword)
  );

module.exports = router;