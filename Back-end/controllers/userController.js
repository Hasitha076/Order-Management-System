const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const userSchema = require("../model/userSchema");
require("dotenv").config();

const salt = 10;

const register = (req, res) => {
  try {
    userSchema.findOne({ email: req.body.email }).then((response) => {
      if (response == null) {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) {
            return res.status(500).json({ message: "Error hashing password" });
          } else {
            const user = new userSchema({
              fullName: req.body.fullName,
              email: req.body.email,
              password: hash,
              activeState: true,
            });

            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.APP_PASSWORD,
              },
            });

            const mailOptions = {
              from: process.env.EMAIL_USERNAME,
              to: req.body.email,
              subject: "New Account Creation",
              text: "You have created your account successfully",
            };

            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                return res.status(500).json({ message: "Error sending email" });
              } else {
                user
                  .save()
                  .then((result) => {
                    return res
                      .status(201)
                      .json({ message: "User created successfully" });
                  })
                  .catch((err) => {
                    return res
                      .status(500)
                      .json({ message: "Error creating user" });
                  });
              }
            });
          }
        });
      } else {
        return res.status(400).json({ message: "User already exists" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user" });
  }
};

const login = async (req, res) => {
  console.log(req.body);
  userSchema.findOne({ email: req.body.email }).then((selectedUser) => {
    if (selectedUser != null) {
      bcrypt.compare(
        req.body.password,
        selectedUser.password,
        (err, result) => {
          if (err) {
            return res.status(401).json({ message: "Invalid credentials" });
          }
          if (result) {
            const payLoad = {
              email: selectedUser.email,
            };

            const secretKey = process.env.SECRET_KEY;
            const expireIn = "24h";
            const token = jwt.sign(payLoad, secretKey, { expiresIn: expireIn });
            return res.status(200).json({ message: "Login successful", token });
          } else {
            return res.status(401).json({ message: "Password is incorrect!" });
          }
        }
      );
    } else {
      return res.status(401).json({ message: "User does not exist!" });
    }
  });
};

module.exports = {
  register,
  login,
};
