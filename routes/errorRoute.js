// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities");
const errorController = require("../controllers/errorController");

router.get("/", utilities.handleErrors(async (req, res, next) => {
    next();
}));

router.get("/", utilities.handleErrors(errorController.intentionalError));

module.exports = router;