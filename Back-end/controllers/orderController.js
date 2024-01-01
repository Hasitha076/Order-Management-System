const orderSchema = require("../model/orderSchema");

const create = (req, res) => {
  const order = new orderSchema({
    date: req.body.date,
    customerDetails: req.body.customerDetails,
    totalCost: req.body.totalCost,
    products: req.body.products,
  });

  order
    .save()
    .then((response) => {
      return res
        .status(201)
        .json({ message: "Order created successfully", order: response });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Order creation failed", error: err });
    });
};

const findById = (req, res) => {
  orderSchema.findById({ _id: req.params.id }).then((result) => {
    if (result != null) {
      return res.status(200).json({ message: "order found", data: result });
    }
    return res.status(404).json({ message: "order not found" });
  });
};

const deleteById = (req, res) => {
  orderSchema.findByIdAndDelete({ _id: req.params.id }).then((result) => {
    if (result != null) {
      return res
        .status(200)
        .json({ message: "order deleted successfully", data: result });
    }
    return res.status(404).json({ message: "order not found" });
  });
};

const updateById = async (req, res) => {
  const result = await orderSchema.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        date: req.body.date,
        customerDetails: req.body.customerDetails,
        totalCost: req.body.totalCost,
        products: req.body.products,
      },
    },
    { new: true }
  );

  if (result) {
    return res
      .status(200)
      .json({ message: "order updated successfully", data: result });
  }
  return res.status(404).json({ message: "order not found" });
};

// const findAll = (req, res) => {
//   orderSchema.find().then((result) => {
//     if (result != null) {
//       return res.status(200).json({ message: "orders found", result });
//     }
//     return res.status(404).json({ message: "orders not found" });
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
    const count = await orderSchema.countDocuments();
    const pages = Math.ceil(count / pageSize);
    const skip = (pageNumber - 1) * pageSize;

    orderSchema
      .find(query)
      .limit(pageSize)
      .skip(skip)
      .then((result) => {
        return res
          .status(200)
          .json({ message: "Order found", result, current: page, pages });
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const countOrder = (req, res) => {
  orderSchema.countDocuments().then((result) => {
    if (result > 0) {
      return res.status(200).json({ message: "Order found", result });
    }
    return res.status(404).json({ message: "Order not found" });
  });
};

const search = (req, res) => {
  // Create a regex based on the name parameter, with case-insensitive search
  const nameRegex = new RegExp(req.params.name, "i");

  orderSchema
    .find({ "customerDetails.name": { $regex: nameRegex } })
    .then((response) => {
      if (response.length > 0) {
        return res.status(200).json({ message: "Order found", response });
      }
      return res.status(404).json({ message: "Order not found" });
    })
    .catch((error) => {
      // Handle any potential errors during the database query
      return res.status(500).json({ message: "Error occurred", error });
    });
};

module.exports = {
  create,
  findById,
  deleteById,
  updateById,
  findAll,
  countOrder,
  search,
};
