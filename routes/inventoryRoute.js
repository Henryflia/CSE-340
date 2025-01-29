// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController.js")
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByVehicleId))
// router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByVehicleId+5) )
module.exports = router;