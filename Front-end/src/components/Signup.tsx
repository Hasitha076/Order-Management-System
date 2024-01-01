import AxiosInstance from "../config/AxiosInstance";
import React, { useState, useRef } from "react";
import Pop from "./cards/Pop";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const popRef = useRef<{
    notify: (message: string, type?: any) => void;
  }>(null);

  const SignUp = async () => {
    try {
      const response = await AxiosInstance.post(`/user/register`, {
        email,
        password,
        fullName,
      });
      console.log(response.data);
      setEmail("");
      setPassword("");
      setFullName("");
      popRef.current?.notify("Registered successfully", "success");
    } catch (error) {
      console.log(error);
      popRef.current?.notify("Register failed!", "error");
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
                value={email}
                type="text"
                className="form-control"
                placeholder="Email here"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <br />
          </div>
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="form-control"
                placeholder="Password here"
              />
            </div>
            <br />
          </div>
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                value={fullName}
                type="text"
                className="form-control"
                placeholder="Full Name here"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12">
            <br />
            <button className="btn btn-primary col-12" onClick={SignUp}>
              Register Now
            </button>
            <br />
            <br />
            <NavLink className="btn btn-outline-dark col-12" to="/login">
              Already have an account
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
