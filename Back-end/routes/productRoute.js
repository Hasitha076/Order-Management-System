const express = require("express");
const router = express.Router();
const verifyProduct = require("../middleware/AuthMiddleWare");

const productSchema = require("../controllers/productController");

// router.post("/create", productSchema.create);
// router.get("/find-by-id/:id", productSchema.findById);
// router.delete("/delete/:id", productSchema.deleteById);
// router.put("/update-by-id/:id", productSchema.updateById);
// router.get("/findAll", productSchema.findAll);
// router.get("/search/:name", productSchema.search);
// router.get("/count", productSchema.countProduct);
// router.get("/minQty", productSchema.findMinProducts);

router.post("/create", verifyProduct, productSchema.create);
router.get("/find-by-id/:id", verifyProduct, productSchema.findById);
router.delete("/delete-by-id/:id", verifyProduct, productSchema.deleteById);
router.put("/update-by-id/:id", verifyProduct, productSchema.updateById);
router.get("/findAll", verifyProduct, productSchema.findAll);
router.get("/search/:name", verifyProduct, productSchema.search);
router.get("/count", verifyProduct, productSchema.countProduct);
router.get("/minQty", verifyProduct, productSchema.findMinProducts);

module.exports = router;
