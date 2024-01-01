const customerSchema = require("../model/customerSchema");

const customerCreate = (req, res) => {
  const customer = new customerSchema({
    name: req.body.name,
    address: req.body.address,
    salary: req.body.salary,
  });

  customer
    .save()
    .then((response) => {
      return res
        .status(201)
        .json({ message: "Customer created successfully", data: response });
    })
    .catch((error) => {
      return res.status(500).json({ message: "Internal server error" });
    });
};

const findById = (req, res) => {
  customerSchema.findOne({ _id: req.params.id }).then((response) => {
    if (response != null) {
      return res.status(200).json({ message: "Customer found", response });
    }
    return res.status(404).json({ message: "Customer not found" });
  });
};

const search = (req, res) => {
  // Create a regex based on the name parameter, with case-insensitive search
  const nameRegex = new RegExp(req.params.name, "i");

  customerSchema
    .find({ name: { $regex: nameRegex } })
    .then((response) => {
      if (response.length > 0) {
        return res.status(200).json({ message: "Customer found", response });
      }
      return res.status(404).json({ message: "Customer not found" });
    })
    .catch((error) => {
      // Handle any potential errors during the database query
      return res.status(500).json({ message: "Error occurred", error });
    });
};

const updateCustomer = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  console.log(req.body);

  const updateData = await customerSchema.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: req.body.name,
        address: req.body.address,
        salary: req.body.salary,
      },
    },
    { new: true }
  );

  if (updateData) {
    console.log(updateData);
    console.log("Customer updated successfully!");
    return res.status(200).json({ message: "Customer updated successfully!" });
  } else {
    console.log("Internal server error");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCustomer = (req, res) => {
  customerSchema.findOneAndDelete({ _id: req.params.id }).then((result) => {
    if (result != null) {
      return res.status(200).json({ message: "Customer deleted successfully" });
    }
    return res.status(404).json({ message: "Customer not found" });
  });
};

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
    const count = await customerSchema.countDocuments();
    const pages = Math.ceil(count / pageSize);
    const skip = (pageNumber - 1) * pageSize;

    customerSchema
      .find(query)
      .limit(pageSize)
      .skip(skip)
      .then((result) => {
        return res
          .status(200)
          .json({ message: "Customer found", result, current: page, pages });
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const countCustomer = (req, res) => {
  customerSchema.countDocuments().then((result) => {
    if (result > 0) {
      return res.status(200).json({ message: "Customer found", result });
    }
    return res.status(404).json({ message: "Customer not found" });
  });
};

module.exports = {
  customerCreate,
  findById,
  updateCustomer,
  deleteCustomer,
  findAll,
  search,
  countCustomer,
};
