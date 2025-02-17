// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController.js")
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");
const { route } = require("./static.js");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByVehicleId))
router.get("/", utilities.handleErrors(invController.buildManagementView));

router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))
router.post("/addClassification", invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification));// ...through the appropriate router, where server-side validation middleware is present,... 

router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory))
router.post("/addInventory", invValidate.inventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.addInventory));
// router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByVehicleId+5) )

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
// Update route
router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditInventory))
router.post("/update/", invValidate.inventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))

module.exports = router;