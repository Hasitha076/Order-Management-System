import React, { useEffect, useState, useRef } from "react";
import Customer from "./Customer";
import Product from "./Product";
import AxiosInstance from "../config/AxiosInstance";
import { Modal } from "react-bootstrap";
import Pop from "./cards/Pop";

interface Cart {
  _id: string | undefined;
  name: string | undefined;
  unitPrice: number | undefined;
  qty: number | undefined;
  totalCost: number | undefined;
}

const Order: React.FC = () => {
  const styleObj: React.CSSProperties = {
    marginBottom: "20px",
  };
  const bottomContext: React.CSSProperties = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
  const totalContext: React.CSSProperties = {
    color: "red",
  };

  const image: React.CSSProperties = {
    width: "50px",
    height: "auto",
  };

  // const qtyInput: React.CSSProperties = {
  //   backgroundColor: "#e9ecef important",
  // };

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [id, setId] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>();
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerSalary, setCustomerSalary] = useState<number | "">("");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>();
  const [productImage, setProductImage] = useState<string | "">("");
  const [productPrice, setProductPrice] = useState<number | "">("");
  const [productQuantity, setProductQuantity] = useState<number | "">("");

  const [qty, setQty] = useState<number | "">("");

  const [cart, setCart] = useState<Cart[]>([]);

  const [modelUpdate, setModalUpdate] = useState<boolean>(false);
  const [modelDelete, setModalDelete] = useState<boolean>(false);

  const [searchProduct, setSearchProduct] = useState("");

  // const [removeQty, setRemoveQty] = useState<number | "">("");

  const [totalPrice, setTotalPrice] = useState<number | "">(0);

  const [updateProductDescription, setUpdateProductDescription] = useState<
    string | ""
  >("");
  const [updateProductPrice, setUpdateProductPrice] = useState<number | "">("");
  const [updateProductQuantity, setUpdateProductQuantity] = useState<
    number | ""
  >("");

  const [updateUserQty, setUpdateUserQty] = useState<number | "">("");

  const [inputStyle, setInputStyle] = useState("#e9ecef");

  const [tempCart, setTempCart] = useState<Cart[]>([]);

  const popRef = useRef<{
    notify: (message: string, type?: any) => void;
  }>(null);

  useEffect(() => {
    allCustomers();
    allProducts();
  }, []);

  const allCustomers = async () => {
    try {
      const response = await AxiosInstance.get(`/customer/findAll`);
      setCustomers(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const allProducts = async () => {
    try {
      const response = await AxiosInstance.get(`/product/findAll`);
      setProducts(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const pickedCustomer = async (id: string) => {
    try {
      if (id != "null") {
        const response = await AxiosInstance.get(`/customer/find-by-id/${id}`);
        setSelectedCustomer(response.data.response);
        setCustomerAddress(response.data.response.address);
        setCustomerSalary(response.data.response.salary);
      } else {
        setCustomerAddress("");
        setCustomerSalary("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pickedProduct = async (id: string) => {
    try {
      if (id != "null") {
        const response = await AxiosInstance.get(`/product/find-by-id/${id}`);
        setSelectedProduct(response.data.result);
        setProductPrice(response.data.result.unitPrice);
        setProductQuantity(response.data.result.qtyOnHand);
        setProductImage(response.data.result.image);

        // console.log(response.data.result);
        qtyCheck(response.data.result._id);
      } else {
        setSelectedProduct(null);
        setProductPrice("");
        setProductQuantity("");
        setProductImage("");
        setInputStyle("#e9ecef");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addCart = async (newItem: Cart) => {
    try {
      if (
        newItem._id !== "null" &&
        !cart.some((item: any) => item._id === newItem._id)
      ) {
        // Calculate total price
        let total = newItem.totalCost ? newItem.totalCost : 0;
        total += cart.reduce(
          (acc, item) => acc + (item.totalCost ? item.totalCost : 0),
          0
        );
        setTotalPrice(total);

        // Add new item to cart
        setCart((prevItem) => [...prevItem, newItem]);

        // Reset various states
        setProducts([]);
        setSelectedProduct(null);
        setProductPrice("");
        setProductQuantity("");
        setProductImage("");
        setQty("");
        allProducts();
        setInputStyle("#e9ecef");

        // Fetch new quantity and update
        // const response = await axios.get(
        //   `/product/find-by-id/${newItem._id}`
        // );
        // const newQty =
        //   response.data.result.qtyOnHand - (newItem.qty ? newItem.qty : 0);
        // updateProductQty(newItem._id, newQty);
      } else {
        alert("Product already added & you acn edit now!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateProductQty = async (id: any, qty: number) => {
    const response = await AxiosInstance.put(`/product/update-by-id/${id}`, {
      qtyOnHand: qty,
    });

    console.log(response.data.result);
  };

  const qtyCheck = async (id: string) => {
    try {
      const response = await AxiosInstance.get(`/product/find-by-id/${id}`);
      const qty = response.data.result.qtyOnHand;
      if (qty == 0) {
        setInputStyle("red");
      } else if (qty <= 20) {
        setInputStyle("yellow");
        console.log("qty is less than 20");
      } else {
        setInputStyle("#e9ecef");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const findtoRemove = (id: any) => {
    setId(id);
    // setRemoveQty(qty);
  };

  const removeCart = async (id: any) => {
    try {
      await AxiosInstance.get(`/product/find-by-id/${id}`);

      setCart((prevState) => {
        const updatedCart = prevState.filter((item: any) => item._id !== id);

        // const newQty = response.data.result.qtyOnHand + (qty ? qty : 0);

        const newTotal = updatedCart.reduce(
          (totalCost: any, item: any) => totalCost + item.totalCost,
          0
        );
        setTotalPrice(newTotal);

        // updateProductQty(id, newQty);

        setModalDelete(false);

        if (selectedProduct != undefined) {
          pickedProduct(id);
        }
        return updatedCart;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateCart = async (id: any) => {
    try {
      const response = await AxiosInstance.get(`/product/find-by-id/${id}`);

      const selectItem = cart.filter((item: any) => item._id === id);
      // console.log(selectItem[0].qty);

      // console.log(response.data.result);
      setUpdateProductDescription(response.data.result.description);
      setUpdateProductPrice(response.data.result.unitPrice);
      setUpdateProductQuantity(response.data.result.qtyOnHand);
      setUpdateUserQty(selectItem[0].qty ? selectItem[0].qty : 0);
      setId(response.data.result._id);
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (id: any, qtyChange: any) => {
    console.log(id, qtyChange);
    try {
      const response = await AxiosInstance.get(`/product/find-by-id/${id}`);
      const productQtyOnHand = response.data.result.qtyOnHand;
      console.log(productQtyOnHand);

      setCart((prevState) => {
        let newTotal = 0;

        const updatedCart = prevState.map((item: any) => {
          if (item._id === id) {
            const newQty = item.qty - (qtyChange ? qtyChange : 0);

            const updatedItem = {
              ...item,
              qty: qtyChange,
              totalCost: item.unitPrice * qtyChange,
            };
            newTotal += updatedItem.totalCost;
            console.log(newQty);

            // Update the product quantity in the database
            // const newProductQty = productQtyOnHand + newQty;

            // updateProductQty(id, newProductQty);

            return updatedItem;
          } else {
            newTotal += item.totalCost;
            return item;
          }
        });

        // Update the total price
        setTotalPrice(newTotal);

        // Additional UI updates (if needed)
        setModalDelete(false);
        if (selectedProduct !== undefined) {
          pickedProduct(id);
        }

        return updatedCart;
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const search = async (searchText: string) => {
  //   try {
  //     if (searchText != "") {
  //       // Save current cart to temporary state before searching
  //       setTempCart(cart);

  //       // Perform search and update cart
  //       const updatedCart = cart.filter((item: any) =>
  //         item.description.toLowerCase().includes(searchText.toLowerCase())
  //       );
  //       setCart(updatedCart);
  //     } else {
  //       // Restore cart from temporary state when search is cleared
  //       setCart(tempCart);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <>
      <Pop ref={popRef} />
      <br />
      <div className="container-fluid">
        <div className="container">
          <div className="row" style={styleObj}>
            <div className="col-lg-3 col-md-12 col-xs-12">
              <div className="form-group">
                <label htmlFor="customer">Select Customer</label>
                <select
                  name="customer"
                  id="customer"
                  className="form-control"
                  onChange={(e) => {
                    pickedCustomer(e.target.value);
                  }}
                >
                  <option value="null">Select Customer</option>
                  {customers.map((customer, index) => {
                    return (
                      <option key={index} value={customer._id}>
                        {customer.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="col-lg-4 col-md-12 col-xs-12">
              <div className="form-group">
                <label htmlFor="address">Customer Address</label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={customerAddress}
                />
              </div>
            </div>

            <div className="col-lg-4 col-md-12 col-xs-12">
              <div className="form-group">
                <label htmlFor="salary">Customer Salary</label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={customerSalary}
                />
              </div>
            </div>
          </div>

          <div className="row" style={styleObj}>
            <div className="col-lg-3 col-md-12 col-xs-12">
              <div className="form-group">
                <label htmlFor="product">Select Product</label>
                <select
                  name="product"
                  id="product"
                  className="form-control"
                  onChange={(e) => {
                    pickedProduct(e.target.value);
                  }}
                >
                  <option value="null">Select Product</option>
                  {products.map((product, index) => {
                    return (
                      <option key={index} value={product._id}>
                        {product.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="col-lg-1 col-md-12 col-xs-12">
              <div className="form-group">
                <label htmlFor="image">Image</label>
                <div>
                  <img
                    src={productImage}
                    alt=""
                    className="img-fluid"
                    style={image}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-12 col-xs-12">
              <div className="form-group">
                <label htmlFor="price">Unit Price</label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={productPrice}
                />
              </div>
            </div>

            <div className="col-lg-3 col-md-12 col-xs-12">
              <div className="form-group">
                <label htmlFor="qtyOnHand">QTY on Hand</label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={productQuantity}
                  style={{ backgroundColor: inputStyle }}
                />
              </div>
            </div>

            <div className="col-lg-2 col-md-12 col-xs-12">
              <div className="form-group">
                <label htmlFor="qty">QTY</label>
                <input
                  type="number"
                  className="form-control"
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value) || "")}
                />
              </div>
            </div>
            <br />
            <div className="col-12">
              <br />
              <button
                className="col-12 btn btn-primary"
                onClick={() => {
                  const cartProduct: Cart = {
                    _id: selectedProduct?._id,
                    name: selectedProduct?.name,
                    unitPrice: selectedProduct?.unitPrice
                      ? selectedProduct?.unitPrice
                      : 0,
                    qty: qty ? qty : 0,
                    totalCost:
                      (qty ? qty : 0) *
                      (selectedProduct?.unitPrice
                        ? selectedProduct?.unitPrice
                        : 0),
                  };

                  if (selectedCustomer?._id === undefined) {
                    alert("Please select a customer");
                  } else if (cartProduct._id === undefined) {
                    alert("Please select a product");
                  } else if (qty == 0) {
                    alert("Please enter a quantity");
                  } else if (
                    (qty ? qty : 0) >
                    (selectedProduct?.qtyOnHand
                      ? selectedProduct?.qtyOnHand
                      : 0)
                  ) {
                    alert("Please enter below of the stock");
                  } else {
                    addCart(cartProduct);
                  }
                }}
              >
                + Add Product
              </button>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12">
              <form className="col-12">
                <input
                  value={searchProduct}
                  type="search"
                  className="form-control"
                  placeholder="Search Product"
                  onChange={(e) => setSearchProduct(e.target.value)}
                  // onKeyUp={() => {
                  //   search(searchProduct);
                  // }}
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
                    <th>Product Name</th>
                    <th>Unit Price</th>
                    <th>Qty</th>
                    <th>total</th>
                    <th>Delete Product</th>
                    <th>Update Product</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((products, index) => {
                    return (
                      <tr key={index}>
                        <td># {index}</td>
                        <td>{products.name}</td>
                        <td>{products.unitPrice}</td>
                        <td>{products.qty}</td>
                        <td>{products.totalCost}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              findtoRemove(products._id);
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
                              UpdateCart(products._id);
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

              <br />

              <div className="bottom-context" style={bottomContext}>
                <div className="total-outer">
                  <h1 style={totalContext}>Total : {totalPrice}</h1>
                </div>
                <div className="place-order-button-context">
                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      await AxiosInstance.post(`/order/create`, {
                        date: new Date(),
                        customerDetails: selectedCustomer,
                        totalCost: totalPrice,
                        products: cart,
                      });
                      setProducts([]);
                      setCustomers([]);
                      setSelectedProduct(null);
                      setCustomerAddress("");
                      setCustomerSalary("");
                      setProductPrice("");
                      setProductQuantity("");
                      setProductImage("");
                      setQty("");
                      allProducts();
                      allCustomers();
                      setCart([]);
                      setTotalPrice(0);
                      popRef.current?.notify(
                        "Placed order successfully",
                        "success"
                      );
                      console.log(cart);
                      cart.map(async (newItem) => {
                        console.log(newItem._id);
                        const response = await AxiosInstance.get(
                          `/product/find-by-id/${newItem._id}`
                        );
                        const newQty =
                          response.data.result.qtyOnHand -
                          (newItem.qty ? newItem.qty : 0);
                        updateProductQty(newItem._id, newQty);
                      });
                    }}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
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
              <p>Are you sure you want to delete this product?</p>
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
                  removeCart(id);
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
              <h2>Update Product</h2>
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
                  value={updateProductDescription}
                  disabled
                />
              </div>
            </div>
            <br />

            <div className="col-12">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={updateProductPrice}
                  disabled
                />
              </div>
            </div>
            <br />

            <div className="col-12">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={updateProductQuantity}
                  disabled
                />
              </div>
            </div>
            <br />

            <div className="col-12">
              <div className="form-group">
                <input
                  type="number"
                  className="form-control"
                  value={updateUserQty}
                  onChange={(e) => {
                    setUpdateUserQty(parseFloat(e.target.value));
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
                  update(id, updateUserQty);
                  setModalUpdate(false);
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

export default Order;
