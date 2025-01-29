const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}
// const invVehi = {}
/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  // res.json({ classificationId: req.params.classificationId });
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByVehicleId = async function (req, res, next) {
    const vehicle_id = req.params.inventoryId;
    const vehicle_data = await invModel.getVehicleId(vehicle_id);
    const vehicle_Html = await utilities.getHtml(vehicle_data[0]);
    let nav = await utilities.getNav();
    const itemN = `${vehicle_data[0].inv_make} ${vehicle_data[0].inv_model}`;


    res.render("./inventory/detail", {
      title: itemN,
      nav,
      vehicle_Html, // Cambié a "vehicleHtml" para que coincida con la plantilla
    });
};


module.exports = invCont
// module.exports = invVehi
