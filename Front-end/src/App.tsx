import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Home from "./components/Home";
import Customer from "./components/Customer";
import Order from "./components/Order";
import Product from "./components/Product";
import Login from "./components/Login";
import React from "react";
import Signup from "./components/Signup";
import ShowCustomers from "./components/ShowCustomers";
import ShowProducts from "./components/ShowProducts";
import ShowOrders from "./components/ShowOrders";

function App() {
  const navBar: React.CSSProperties = {
    justifyContent: "space-between",
  };

  return (
    <Router>
      <div>
        <nav
          className="navbar navbar-expand-lg bg-dark border-bottom border-body"
          data-bs-theme="dark"
        >
          <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">
              <img
                src="https://accelgrid.com/wp-content/uploads/2020/08/amazon-icon.png"
                alt=""
                className="logo"
              />
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarNav"
              style={navBar}
            >
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink className="nav-link" aria-current="page" to="/">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/customer">
                    Customer
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/order">
                    Order Management
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/product">
                    Product
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
              </ul>
              <form className="d-flex" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/order" element={<Order />} />
          <Route path="/product" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/showCustomers" element={<ShowCustomers />} />
          <Route path="/showProducts" element={<ShowProducts />} />
          <Route path="/showOrders" element={<ShowOrders />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
