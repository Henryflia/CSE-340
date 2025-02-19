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
    const inv_id = req.params.inventoryId;
    const vehicle = await invModel.getVehicleId(inv_id);
    const vehicle_Html = await utilities.getHtml(vehicle[0]);
    let nav = await utilities.getNav();
    // const itemN = `${vehicle_data[0].inv_make} ${vehicle_data[0].inv_model}`;


    res.render("./inventory/detail", {
      title: `${vehicle[0].inv_make} ${vehicle[0].inv_model}`,
      nav,
      vehicle_Html // Cambié a "vehicleHtml" para que coincida con la plantilla
    });
};

invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Management",
    errors: null,
    nav,
    classificationSelect,
  });
};


invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/addClassification", {
    title: "Add New Classification",
    errors: null,
    nav,
  });
};

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  const response = await invModel.addClassification(classification_name); // ...to a function within the inventory model...
  let nav = await utilities.getNav(); // After query, so it shows new classification
  if (response) {
    req.flash(
      "notice",
      `The "${classification_name}" classification was successfully added.`
    );
    res.render("inventory/management", {
      title: "Vehicle Management",
      errors: null,
      nav,
      classification_name,
    });
  } else {
    req.flash("notice", `Failed to add ${classification_name}`);
    res.render("inventory/addClassification", {
      title: "Add New Classification",
      errors: null,
      nav,
      classification_name,
    });
  }
};

invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  let classifications = await utilities.buildClassificationList();

  res.render("inventory/addInventory", {
    title: "Add Vehicle",
    errors: null,
    nav,
    classifications,
  });
};


invCont.addInventory = async function (req, res, next) {
  const nav = await utilities.getNav();

  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const response = invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (response) {
    req.flash(
      "notice",
      `The ${inv_year} ${inv_make} ${inv_model} successfully added.`
    );
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    // This seems to never get called. Is this just for DB errors?
    req.flash("notice", "There was a problem.");
    res.render("inventory/addInventory", {
      title: "Add Vehicle",
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.buildEditInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventory_id);
  console.log(inventory_id)
  const nav = await utilities.getNav();

  const inventoryData = (
    await invModel.getVehicleId(inventory_id))[0]; // Change this function to return the first item
  const name = `${inventoryData.inv_make} ${inventoryData.inv_model}`;

  let classifications = await utilities.buildClassificationList(inventoryData.classification_id);

  res.render("inventory/editInventory", {
    title: "Edit " + name,
    errors: null,
    nav,
    classifications,
    inv_id: inventoryData.inv_id,
    inv_make: inventoryData.inv_make,
    inv_model: inventoryData.inv_model,
    inv_year: inventoryData.inv_year,
    inv_description: inventoryData.inv_description,
    inv_image: inventoryData.inv_image,
    inv_thumbnail: inventoryData.inv_thumbnail,
    inv_price: inventoryData.inv_price,
    inv_miles: inventoryData.inv_miles,
    inv_color: inventoryData.inv_color,
    classification_id: inventoryData.classification_id,
  });
};

invCont.updateInventory = async function (req, res, next) {
  const nav = await utilities.getNav();

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const response = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (response) {
    const itemName = response.inv_make + " " + response.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classifications = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/deleteInventory", {
      title: "Edit" + itemName,
      nav,
      errors: null,
      classifications,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

// Delete View
invCont.buildDeleteInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventory_id);
  console.log(inventory_id)
  const nav = await utilities.getNav();

  const inventoryData = (
    await invModel.getVehicleId(inventory_id))[0]; // Change this function to return the first item
  const name = `${inventoryData.inv_make} ${inventoryData.inv_model}`;

  res.render("inventory/delete-confirm", {
    title: "Delete" + name,
    errors: null,
    nav,
    inv_id: inventoryData.inv_id,
    inv_make: inventoryData.inv_make,
    inv_model: inventoryData.inv_model,
    inv_year: inventoryData.inv_year,
    inv_price: inventoryData.inv_price,
  });
};

invCont.deleteInventory = async function (req, res, next) {
  const nav = await utilities.getNav();

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  } = req.body;

  const response = await invModel.deleteInventory(inv_id)
  const itemName = `${inv_make} ${inv_model}`;

  if (response) {
    req.flash("notice", `The ${itemName} was successfully deleted.`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};

module.exports = invCont
// module.exports = invVehi
