/* ******************************************
* This server.js file is the primary file of the
* application. It is used to control the project.
*******************************************/
/* ***********************
* Require Statements
*************************/
const session = require("express-session")
const pool = require('./database/')
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/index")
const accountRoute = require('./routes/accountRoute')
const intentionalErrorRoute = require("./routes/intentionalErrorRoute.js");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const messageRoute = require('./routes/messageRoute')



/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))



// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// Cookie parser
app.use(cookieParser())

// JWT checker
app.use(utilities.checkJWTToken);


/* ***********************
* View Engine and Templates
*************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
* Routes
*************************/
app.use(static)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes
app.use("/account", require("./routes/accountRoute"))

// Message routes
app.use("/message", messageRoute)

// Error routes
app.use("/ierror", intentionalErrorRoute);

app.use(async (req, res, next) => {
    next({status: 400, message: 'Sorry, we appear to have lost that page.'})
  })
/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
    let nav = await utilities.getNav()
    console.error(`Error at: "${req.originalUrl}": ${err.message}`)
    if(err.status == 400){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
    res.render("errors/error", {
      title: err.status || 'Server Error',
      message,
      nav
    })
  })

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";
 
/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, host, (err) => {
  if (err) {
    console.error('Error occured: ${err.message}');
  }
  else{
    console.log(`Server running at http://${host}:${port}/`);
  }
});