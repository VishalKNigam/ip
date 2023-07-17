const express = require("express");
const bcrypt = require("bcrypt");
var cookieParser = require('cookie-parser')

const jwt = require("jsonwebtoken");
const Redis = require("ioredis");
const redis = new Redis();
const winstonlogger = require("winston");
const { UserModel } = require("../routes/user.model");
const UserRouter = express.Router();
UserRouter.use(cookieParser())
// winstonlogger redis
UserRouter.get("/", async (req, res) => {
  const users = await UserModel.find();
  res.send(users);
});
UserRouter.post("/register", async (req, res) => {
  const { name, email, pass } = req.body;
  try {
    const IsuserAlreadyPresent = await UserModel.findOne({ email });
    if (IsuserAlreadyPresent) {
      res.json({
        msg: `${IsuserAlreadyPresent.email} already present. Please use different email`,
      });
    }
    bcrypt.hash(pass, 5, async (err, hash) => {
      if (err) {
        res.json(err);
      } else {
        const user = new UserModel({ name, email, pass: hash });
        await user.save();
        res.send(`New User ${user.name} has been added Successfully!!`);
      }
    });
  } catch (err) {
    //console.log({err:err.message});
    winstonlogger.error(error.message);
    res.json({ err: err.message });
  }
});
UserRouter.post("/login", async (req, res) => {
  const { name, email, pass } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    try {
      bcrypt.compare(pass, user.pass, async (err, decode) => {
        if (err) {
          res.send(err);
        }
        if (decode) {
          const token = jwt.sign({ userID: user._id }, "masai", {
            expiresIn: 3600,
          });
          const refreshToken = jwt.sign({ userID: user._id },"masai", {expiresIn: "7d"})
          res.json({
            msg: `User ${user.name} has beeen logged Successfully!`,
            token: token,
            refreshToken: refreshToken
          });
          redis.set("token",token, "EX", 3600 );
          redis.set("refreshtoken", refreshToken, "EX", 3600);
                }else{
            res.send("Wrong Password!")
        }
      });
    } catch (err) {
      console.log({ err: err.message });
      res.json({ err: err.message });
    }
  } else {
    res.send("Please register first!!");
  }
});
UserRouter.post("/logout", async (req, res) => {
  const { name, email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email });
  } catch (err) {
    console.log({ err: err.message });
    res.json({ err: err.message });
  }
});
module.exports = { UserRouter };
