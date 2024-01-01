import AxiosInstance from "../config/AxiosInstance";
import React, { useState, useRef } from "react";
import Pop from "./cards/Pop";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const popRef = useRef<{
    notify: (message: string, type?: any) => void;
  }>(null);

  const Login = async () => {
    try {
      const response = await AxiosInstance.post(`/user/login`, {
        email,
        password,
      });
      // console.log(response.data.token);

      popRef.current?.notify("Logged successfully", "success");

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 2);

      const cookieValue =
        encodeURIComponent("token") +
        "=" +
        encodeURIComponent(response.data.token) +
        "; expires=" +
        expirationDate.toUTCString() +
        "; path=/;";
      document.cookie = cookieValue;
    } catch (error) {
      console.log(error);
      popRef.current?.notify("Login failed!", "error");
    }
  };

  const mainStyle: React.CSSProperties = {
    minHeight: "80vh",
    display: "flex",
  };

  const rowStyle: React.CSSProperties = {
    width: "50%",
    margin: "auto",
    border: "2px solid #000",
    padding: "20px 10px",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.8)",
  };

  return (
    <>
      <Pop ref={popRef} />
      <br />
      <div className="container" style={mainStyle}>
        <div className="row" style={rowStyle}>
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                className="form-control"
                placeholder="Email here"
              />
            </div>
            <br />
          </div>
          <div className="col-12">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              className="form-control"
              placeholder="Password here"
            />
          </div>
          <div className="col-12">
            <br />
            <button className="btn btn-primary col-12" onClick={Login}>
              Login
            </button>
            <br />
            <br />
            <NavLink className="btn btn-outline-dark col-12" to="/signup">
              Sign up
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
