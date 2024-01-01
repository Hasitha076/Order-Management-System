import React, { useEffect, useState } from "react";
import DefaultCard from "./cards/DefaultCard";
import AxiosInstance from "../config/AxiosInstance";

import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import MinQtyCard from "./cards/MinQtyCard";
import Product from "./Product";
import IncomeCard from "./cards/IncomeCard";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
// defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const Home: React.FC = () => {
  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
  };

  const categoryCard: React.CSSProperties = {
    height: "300px",
  };

  useEffect(() => {
    countCustomer();
    countProduct();
    countOrder();
    countIncome();
    checkQty();
  }, []);

  const [products, setProducts] = useState<Product[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [incomeCount, setIncomeCount] = useState(0);
  const [animatedCounter, setAnimatedCounter] = useState(0);

  const countCustomer = async () => {
    try {
      const response = await AxiosInstance.get("/customer/count");
      setCustomerCount(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const countProduct = async () => {
    try {
      const response = await AxiosInstance.get("/product/count");
      setProductCount(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const checkQty = async () => {
    try {
      const response = await AxiosInstance.get("/product/minQty");
      setProducts(response.data.qty);
    } catch (error) {
      console.log(error);
    }
  };

  const countOrder = async () => {
    try {
      const response = await AxiosInstance.get("/order/count");
      setOrderCount(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const countIncome = async () => {
    try {
      const response = await AxiosInstance.get("/order/findAll");

      let totalIncome = 0;
      response.data.result.forEach((order: any) => {
        totalIncome += order.totalCost;
      });
      setIncomeCount(totalIncome);
      console.log(totalIncome);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    countIncome();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const difference = incomeCount - animatedCounter;

      if (difference <= 10) {
        setAnimatedCounter(incomeCount);
        clearInterval(interval);
        return;
      }

      const incrementAmount = Math.ceil(difference / 10);

      setAnimatedCounter((prev) => prev + incrementAmount);
    }, 20);

    return () => clearInterval(interval);
  }, [animatedCounter, incomeCount]);

  // pie chart data
  let data = [
    {
      label: "Customers",
      value: customerCount,
    },
    {
      label: "Products",
      value: productCount,
    },
    {
      label: "Order",
      value: orderCount,
    },
  ];

  return (
    <>
      <div className="container fluid">
        <div className="container">
          <div className="row mt-4" style={rowStyle}>
            <div className="col-lg-3 col-md-6 col-xs-12">
              <DefaultCard
                thumbnail="<i class='bi bi-person-circle'></i>"
                description="This is the Customer section"
                title="Customers"
                value={customerCount}
                path="/showCustomers"
                item="Customer"
                // key={1}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-xs-12">
              <DefaultCard
                thumbnail="<i class='bi bi-stack'></i>"
                description="This is the Product section"
                title="Product"
                value={productCount}
                path="/showProducts"
                item="Product"
                // key={1}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-xs-12">
              <DefaultCard
                thumbnail="<i class='bi bi-cart4'></i>"
                description="This is the Order section"
                title="Order"
                value={orderCount}
                path="/showOrders"
                item="Order"
                // key={1}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-xs-12">
              <IncomeCard
                thumbnail="<i class='bi bi-wallet-fill'></i>"
                title="Net Income"
                value={"Rs." + animatedCounter}
                // key={1}
              />
            </div>
          </div>
          <div className="row pt-5">
            <div className="col-6 dataCard customerCard">
              <Bar
                data={{
                  labels: data.map((data) => data.label),
                  datasets: [
                    {
                      label: "Count",
                      data: data.map((data) => data.value),
                      backgroundColor: [
                        "rgba(43, 63, 229, 0.8)",
                        "rgba(250, 192, 19, 0.8)",
                        "rgba(253, 135, 135, 0.8)",
                      ],
                      borderRadius: 5,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    title: {
                      text: "Revenue Source",
                    },
                  },
                }}
              />
            </div>

            <div className="col-6 dataCard categoryCard" style={categoryCard}>
              <Doughnut
                data={{
                  labels: data.map((data) => data.label),
                  datasets: [
                    {
                      label: "Count",
                      data: data.map((data) => data.value),
                      backgroundColor: [
                        "rgba(43, 63, 229, 0.8)",
                        "rgba(250, 192, 19, 0.8)",
                        "rgba(253, 135, 135, 0.8)",
                      ],
                      borderColor: [
                        "rgba(43, 63, 229, 0.8)",
                        "rgba(250, 192, 19, 0.8)",
                        "rgba(253, 135, 135, 0.8)",
                      ],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    title: {
                      text: "Pie Chart",
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="row py-5">
            <div className="col-12 pb-3">
              <h6>Low quantity products</h6>
            </div>
            {products.map((item, index) => {
              return (
                <div key={index} className="col-4">
                  <MinQtyCard
                    name={item.name}
                    image={item.image}
                    description={item.description}
                    qtyOnHand={item.qtyOnHand}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
