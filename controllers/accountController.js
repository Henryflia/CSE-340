const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const { updateRules } = require("../utilities/account-validation")
const messageModel = require("../models/message-model");


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    // req.flash("notice", "This is a flash message.!!!@2")
    res.render("account/login", {
      title: "Login",
      errors: null,
      nav,
    })
  }

  async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    // req.flash("notice", "This is a flash message.!!!@2")
    res.render("account/register", {
      title: "Register",
      errors: null,
      nav,
    })
  }

  async function buildUpdate(req, res, next) {
    let nav = await utilities.getNav();
  
    const accountDetails = await accountModel.getAccountById(req.params.accountId);
    const {account_id, account_firstname, account_lastname, account_email} = accountDetails;
    res.render("account/update", {
      title: "Update",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    });
  }
  


  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(400).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      utilities.updateCookie(accountData, res);
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const regResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you've updated ${account_firstname}.`
    );

    //Update the cookie accountData
    // TODO: Better way to do this?

    const accountData = await accountModel.getAccountById(account_id); // Get it from db so we can remake the cookie
    delete accountData.account_password;
    res.locals.accountData.account_firstname = accountData.account_firstname; // So it displays correctly
    
    utilities.updateCookie(accountData, res); // Remake the cookie with new data

    res.status(201).render("account/account-management", {
      title: "Management",
      errors: null,
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/update", {
      title: "Update",
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      nav,
    });
  }
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav();

  const { account_id, account_password } = req.body;

  // Hash the password before storing.
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the password update."
    );
    res.status(500).render("account/update", {
      title: "Update",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you've updated the password.`
    );
    res.status(201).render("account/account-management", {
      title: "Manage",
      errors: null,
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the password update failed.");
    res.status(501).render("account/update", {
      title: "Update",
      errors: null,
      nav,
    });
  }
}

async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav();
  const unread = await messageModel.getMessageCountById(res.locals.accountData.account_id);
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
    unread,
  });
  return; 
}

async function accountLogout(req, res) {
  res.clearCookie("jwt")
  delete res.locals.accountData;
  res.locals.loggedin = 0
  req.flash("notice", "Logout successful.")
  res.redirect("/");
  return; 
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildUpdate, updatePassword, updateAccount, accountLogout}