const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// connect DB
const connectDB = require("./config/db");
connectDB();

// routers
const userRouter = require("./routes/userRoute");
const customerRouter = require("./routes/customerRoute");
const productRouter = require("./routes/productRoute");
const orderRouter = require("./routes/orderRoute");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000/",
      "http://order-management-system.onrender.com",
    ],
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
