import AxiosInstance from "../config/AxiosInstance";
import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import Pop from "./cards/Pop";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Product from "./Product";
import Customer from "./Customer";

interface Order {
  _id: string;
  date: Date;
  customerDetails: Customer;
  totalCost: number;
  products: Product[];
}

const ShowOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const [id, setId] = useState("");

  const [modelUpdate, setModalUpdate] = useState<boolean>(false);
  const [modelDelete, setModalDelete] = useState<boolean>(false);

  const [updateName, setUpdateName] = useState("");
  const [updateAddress, setUpdateAddress] = useState("");
  const [updateSalary, setUpdateSalary] = useState<number | "">("");

  const [searchOrder, setSearchOrder] = useState("");

  const popRef = useRef<{
    notify: (message: string, type?: any) => void;
  }>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    findAllOrders(currentPage);
  }, [currentPage]); // Add currentPage to the dependency array

  // const findAllOrders = async () => {
  //   try {
  //     const response = await AxiosInstance.get(`/order/findAll`);
  //     setOrders(response.data.result);
  //     console.log(response.data.result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const findAllOrders = async (currentPage: any) => {
    try {
      const response = await AxiosInstance.get(
        `/order/findAll?page=${currentPage}`
      );
      setOrders(response.data.result);
      setPages(response.data.pages);
      console.log(`current page is ${currentPage}`);
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
    console.log(`active page is ${pageNumber}`);
    findAllOrders(pageNumber); // Call findAllOrders with the new page number
  };

  // Basic Pagination Control
  const Pagination = ({ pages, currentPage }: any) => {
    // Handler for the Previous page
    console.log(currentPage);
    const handlePrevPage = () => {
      console.log("Previous page");
      if (currentPage > 1) {
        handlePageChange(currentPage - 1);
      }
    };

    // Handler for the Next page
    const handleNextPage = () => {
      console.log("Next page");
      if (currentPage < pages) {
        handlePageChange(currentPage + 1);
      }
    };

    return (
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button onClick={handlePrevPage} className="page-link btn">
              Previous
            </button>
          </li>
          {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              className={`page-item ${page === currentPage ? "active" : ""}`}
            >
              <a onClick={() => handlePageChange(page)} className="page-link">
                {page}
              </a>
            </li>
          ))}
          <li
            className={`page-item ${currentPage === pages ? "disabled" : ""}`}
          >
            <button
              onClick={handleNextPage}
              className="page-link btn btn-primary"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const findOrder = async (id: any) => {
    try {
      setId(id);
      console.log(id);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrder = async (id: any) => {
    try {
      const response = await AxiosInstance.delete(`/order/delete-by-id/${id}`);
      setModalDelete(false);
      findAllOrders(currentPage);
      popRef.current?.notify("Delete successfully", "success");
    } catch (error) {
      console.log(error);
    }
  };

  const findUpdateOrder = async (id: any) => {
    try {
      const response = await AxiosInstance.get(`/order/find-by-id/${id}`);
      //   console.log(response);
      setId(response.data.response._id);
      setUpdateName(response.data.response.name);
      setUpdateAddress(response.data.response.address);
      setUpdateSalary(response.data.response.salary);
    } catch (error) {
      console.log(error);
    }
  };

  const updateOrder = async (
    id: string,
    updateName: string,
    updateAddress: string,
    updateSalary: any
  ) => {
    console.log(id);
    try {
      const response = await AxiosInstance.put(`/order/update/${id}`, {
        name: updateName,
        address: updateAddress,
        salary: updateSalary,
      });
      setModalUpdate(false);
      findAllOrders(currentPage);
      popRef.current?.notify("Update successfully", "success");
    } catch (error) {
      console.log(error);
    }
  };

  const search = async (search: string) => {
    try {
      if (search != "") {
        const response = await AxiosInstance.get(`/order/search/${search}`);

        setOrders(response.data.response);
        console.log(response);
      } else {
        findAllOrders(currentPage);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {/* <Pop /> */}
      <Pop ref={popRef} />
      <br />
      <div className="container-fluid">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Orders
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-12">
              <h1>Orders</h1>
            </div>
            <div className="col-12 my-3">
              <form className="col-12">
                <input
                  value={searchOrder}
                  type="search"
                  className="form-control"
                  placeholder="Search Customer"
                  onChange={(e) => setSearchOrder(e.target.value)}
                  onKeyUp={() => {
                    search(searchOrder);
                  }}
                />
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <table className="table table-hover table bordered text-center">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Order Date</th>
                    <th>Customer Details</th>
                    <th>Products</th>
                    <th>Total Cost (Rs.)</th>
                    <th>Delete Order</th>
                    <th>Update Order</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td># {index}</td>
                      <td>{new Date(order.date).toLocaleDateString()}</td>
                      <td>{order.customerDetails.name}</td>
                      <td>
                        <select className="form-select">
                          {order.products.map((product: any, productIndex) => (
                            <option key={productIndex} value={product.name}>
                              {product.name} - Rs.{product.unitPrice.toFixed(2)}{" "}
                              x {product.qty}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>Rs.{order.totalCost.toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            findOrder(order._id);
                            setModalDelete(true);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => {
                            findUpdateOrder(order._id);
                            setModalUpdate(true);
                          }}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination pages={pages} currentPage={currentPage} />
        </div>
      </div>

      {/* Pop up modals */}

      <Modal show={modelDelete}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Order</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                style={{ border: "none", backgroundColor: "transparent" }}
              >
                <span
                  style={{ fontSize: "25px" }}
                  aria-hidden="true"
                  onClick={() => {
                    setModalDelete(false);
                  }}
                >
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this order?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => {
                  setModalDelete(false);
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  deleteOrder(id);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal show={modelUpdate}>
        <div className="row">
          <div className="p-4">
            <div
              className="col-12"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2>Update Order</h2>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                style={{ border: "none", backgroundColor: "transparent" }}
              >
                <span
                  style={{ fontSize: "25px" }}
                  aria-hidden="true"
                  onClick={() => {
                    setModalUpdate(false);
                  }}
                >
                  &times;
                </span>
              </button>
            </div>
            <br />
            <div className="col-12">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={updateName}
                  onChange={(e) => {
                    setUpdateName(e.target.value);
                  }}
                />
              </div>
            </div>
            <br />

            <div className="col-12">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={updateAddress}
                  onChange={(e) => {
                    setUpdateAddress(e.target.value);
                  }}
                />
              </div>
            </div>
            <br />

            <div className="col-12">
              <div className="form-group">
                <input
                  type="number"
                  className="form-control"
                  value={updateSalary}
                  onChange={(e) => {
                    setUpdateSalary(parseFloat(e.target.value) | 0);
                  }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => {
                  setModalUpdate(false);
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => {
                  updateOrder(id, updateName, updateAddress, updateSalary);
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ShowOrders;
