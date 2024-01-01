const express = require("express");
const router = express.Router();
const verifyCustomer = require("../middleware/AuthMiddleWare");

const customerSchema = require("../controllers/customerController");

// router.post("/create", customerSchema.customerCreate);
// router.get("/find-by-id/:id", customerSchema.findById);
// router.put("/update/:id", customerSchema.updateCustomer);
// router.delete("/delete/:id", customerSchema.deleteCustomer);
// router.get("/findAll", customerSchema.findAll);
// router.get("/search/:name", customerSchema.search);
// router.get("/count", customerSchema.countCustomer);

router.post("/create", verifyCustomer, customerSchema.customerCreate);
router.get("/find-by-id/:id", verifyCustomer, customerSchema.findById);
router.put("/update/:id", verifyCustomer, customerSchema.updateCustomer);
router.delete("/delete/:id", verifyCustomer, customerSchema.deleteCustomer);
router.get("/findAll", verifyCustomer, customerSchema.findAll);
router.get("/search/:name", verifyCustomer, customerSchema.search);
router.get("/count", verifyCustomer, customerSchema.countCustomer);

module.exports = router;
