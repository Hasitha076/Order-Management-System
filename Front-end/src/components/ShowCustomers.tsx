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

interface Customer {
  _id: string;
  name: string;
  address: string;
  salary: number;
}

const ShowCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [id, setId] = useState("");

  const [modelUpdate, setModalUpdate] = useState<boolean>(false);
  const [modelDelete, setModalDelete] = useState<boolean>(false);

  const [updateName, setUpdateName] = useState("");
  const [updateAddress, setUpdateAddress] = useState("");
  const [updateSalary, setUpdateSalary] = useState<number | "">("");

  const [searchCustomer, setSearchCustomer] = useState("");

  const popRef = useRef<{
    notify: (message: string, type?: any) => void;
  }>(null);

  const [currentPage, setCurrentPage] = useState<any | "">(1);
  const [pages, setPages] = useState<any | "">(0);

  useEffect(() => {
    findAllCustomer(currentPage);
  }, []);

  // const findAllCustomer = async () => {
  //   try {
  //     const response = await AxiosInstance.get(`/customer/findAll`);
  //     setCustomers(response.data.result);
  //     console.log(response.data.result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
    console.log(`active page is ${pageNumber}`);
    findAllCustomer(pageNumber);
  };

  const findAllCustomer = async (currentPage: any) => {
    try {
      const response = await AxiosInstance.get(
        `/customer/findAll?page=${currentPage}`
      );
      setCustomers(response.data.result);
      setPages(response.data.pages);
      console.log(`current page is ${currentPage}`);
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Basic Pagination Control
  const Pagination = ({ pages, currentPage }) => {
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

  const findCustomer = async (id: any) => {
    try {
      setId(id);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCustomer = async (id: any) => {
    try {
      const response = await AxiosInstance.delete(`/customer/delete/${id}`);
      setModalDelete(false);
      findAllCustomer(currentPage);
      popRef.current?.notify("Delete successfully", "success");
    } catch (error) {
      console.log(error);
    }
  };

  const findUpdateCustomer = async (id: any) => {
    try {
      const response = await AxiosInstance.get(`/customer/find-by-id/${id}`);
      console.log(response);
      setId(response.data.response._id);
      setUpdateName(response.data.response.name);
      setUpdateAddress(response.data.response.address);
      setUpdateSalary(response.data.response.salary);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCustomer = async (
    id: string,
    updateName: string,
    updateAddress: string,
    updateSalary: any
  ) => {
    console.log(id);
    try {
      const response = await AxiosInstance.put(`/customer/update/${id}`, {
        name: updateName,
        address: updateAddress,
        salary: updateSalary,
      });
      setModalUpdate(false);
      findAllCustomer(currentPage);
      popRef.current?.notify("Update successfully", "success");
    } catch (error) {
      console.log(error);
    }
  };

  const search = async (search: string) => {
    try {
      if (search != "") {
        const response = await AxiosInstance.get(`/customer/search/${search}`);

        setCustomers(response.data.response);
      } else {
        findAllCustomer(currentPage);
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
                Customers
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-12">
              <h1>Customers</h1>
            </div>
            <div className="col-12 my-3">
              <form className="col-12">
                <input
                  value={searchCustomer}
                  type="search"
                  className="form-control"
                  placeholder="Search Customer"
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  onKeyUp={() => {
                    search(searchCustomer);
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
                    <th>Customer Name</th>
                    <th>Address</th>
                    <th>Salary</th>
                    <th>Delete Customer</th>
                    <th>Update Customer</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => {
                    return (
                      <tr key={index}>
                        <td># {index}</td>
                        <td>{customer.name}</td>
                        <td>{customer.address}</td>
                        <td>{customer.salary}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              findCustomer(customer._id);
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
                              findUpdateCustomer(customer._id);
                              setModalUpdate(true);
                            }}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
              <h5 className="modal-title">Delete Customer</h5>
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
              <p>Are you sure you want to delete this customer?</p>
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
                  deleteCustomer(id);
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
              <h2>Update Customer</h2>
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
                  updateCustomer(id, updateName, updateAddress, updateSalary);
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

export default ShowCustomers;
