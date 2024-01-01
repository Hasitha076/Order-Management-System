const productSchema = require("../model/productSchema");

const create = (req, res) => {
  const product = new productSchema({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    unitPrice: req.body.unitPrice,
    qtyOnHand: req.body.qtyOnHand,
  });

  product.save().then((result) => {
    if (result) {
      return res
        .status(201)
        .json({ message: "Product created successfully", data: result });
    }
    return res.status(400).json({ message: "Product not created" });
  });
};

const findById = (req, res) => {
  productSchema.findById({ _id: req.params.id }).then((result) => {
    if (result != null) {
      return res.status(200).json({ message: "Product found", result });
    }
    return res.status(404).json({ message: "Product not found" });
  });
};

const deleteById = (req, res) => {
  productSchema.findByIdAndDelete({ _id: req.params.id }).then((result) => {
    if (result != null) {
      return res
        .status(200)
        .json({ message: "Product deleted successfully", result });
    }
    return res.status(404).json({ message: "Product not found" });
  });
};

const updateById = async (req, res) => {
  console.log(req.params.id);
  const result = await productSchema.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        unitPrice: req.body.unitPrice,
        qtyOnHand: req.body.qtyOnHand,
      },
    },
    { new: true }
  );

  if (result) {
    return res
      .status(200)
      .json({ message: "Product updated successfully", result });
  }
  return res.status(404).json({ message: "Product not found" });
};

// const findAll = (req, res) => {
//   productSchema.find().then((result) => {
//     if (result != null) {
//       return res.status(200).json({ message: "Products found", result });
//     }
//     return res.status(404).json({ message: "Products not found" });
//   });
// };

const findAll = async (req, res) => {
  try {
    const { searchText, page = 1, size = 5 } = req.query;
    const pageNumber = parseInt(page);
    console.log(pageNumber);
    const pageSize = parseInt(size);

    const query = {};
    if (searchText) {
      query.$text = { $search: searchText };
    }
    const count = await productSchema.countDocuments();
    const pages = Math.ceil(count / pageSize);
    const skip = (pageNumber - 1) * pageSize;

    productSchema
      .find(query)
      .limit(pageSize)
      .skip(skip)
      .then((result) => {
        return res
          .status(200)
          .json({ message: "Product found", result, current: page, pages });
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const search = (req, res) => {
  // Create a regex based on the name parameter, with case-insensitive search
  const nameRegex = new RegExp(req.params.name, "i");

  productSchema
    .find({ name: { $regex: nameRegex } })
    .then((response) => {
      if (response.length > 0) {
        return res.status(200).json({ message: "Product found", response });
      }
      return res.status(404).json({ message: "Product not found" });
    })
    .catch((error) => {
      // Handle any potential errors during the database query
      return res.status(500).json({ message: "Error occurred", error });
    });
};

const countProduct = (req, res) => {
  productSchema.countDocuments().then((result) => {
    if (result > 0) {
      return res.status(200).json({ message: "Product found", result });
    }
    return res.status(404).json({ message: "Product not found" });
  });
};

const findMinProducts = (req, res) => {
  let qty = [];

  productSchema.find().then((result) => {
    if (result != null) {
      result.map((item) => {
        if (item.qtyOnHand <= 10) {
          qty.push(item);
        }
      });

      return res.status(200).json({ message: "Products found", qty });
    }
    return res.status(404).json({ message: "Products not found" });
  });
};

module.exports = {
  create,
  findById,
  deleteById,
  updateById,
  findAll,
  search,
  countProduct,
  findMinProducts,
};
