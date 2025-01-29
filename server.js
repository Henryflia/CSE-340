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
const utilities = require('./utilities/index');
const accountRoute = require('./routes/accountRoute')
// const errorRoutes = require("./routes/errorRoute");

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
app.use("/account", accountRoute)

// Error routes
// app.use("/errors", errorRoutes);

app.use(async (req, res, next) => {
    next({status: 404, message: 'Sorry, we appear to have lost that page.'})
  })
/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
    let nav = await utilities.getNav()
    console.error(`Error at: "${req.originalUrl}": ${err.message}`)
    if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
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
const port = process.env.PORT 
const host = process.env.HOST

/* ***********************
* Log statement to confirm server operation
*************************/
app.listen(port, () => {
console.log(`app listening on ${host}:${port}`)
})


app.listen(port, host, (err) => {

  if (err) {

    console.error(`Error occurred: ${err.message}`);

  } else {

    console.log(`Server running at http://${host}:${port}/`);

  }

}); 