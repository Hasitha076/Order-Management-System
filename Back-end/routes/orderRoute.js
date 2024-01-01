const express = require("express");
const router = express.Router();
const verifyOrder = require("../middleware/AuthMiddleWare");

const orderSchema = require("../controllers/orderController");

// router.post("/create", orderSchema.create);
// router.get("/find-by-id/:id", orderSchema.findById);
// router.delete("/delete-by-id/:id", orderSchema.deleteById);
// router.put("/update-by-id/:id", orderSchema.updateById);
// router.get("/findAll", orderSchema.findAll);
// router.get("/count", orderSchema.countOrder);

router.post("/create", verifyOrder, orderSchema.create);
router.get("/find-by-id/:id", verifyOrder, orderSchema.findById);
router.delete("/delete-by-id/:id", verifyOrder, orderSchema.deleteById);
router.put("/update-by-id/:id", verifyOrder, orderSchema.updateById);
router.get("/findAll", verifyOrder, orderSchema.findAll);
router.get("/count", verifyOrder, orderSchema.countOrder);
router.get("/search/:name", verifyOrder, orderSchema.search);

module.exports = router;
