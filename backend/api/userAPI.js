const express = require("express");
const route = express();
const bcrypt = require("bcrypt");
const userModel = require("../models/userSchema");
const postModel = require("../models/postSchema");
var jwt = require("jsonwebtoken");

route.post("/sign-up", async (req, res) => {
  const {name, email, password} = req.body;
  const isExist = await userModel.findOne({email});
  if (!name || !email || !password) {
    console.log("saye details important hai");
    return res.status(404).json({msg: "fill all the details"});
  }
  if (isExist) {
    console.log("ye user phle se hi data me hai");
    return res.status(404).json({msg: "email is already registerd"});
  }
  bcrypt.hash(password, 10, async (err, hash) => {
    const username = name + Math.floor(Math.random() * 1000).toString()
    await userModel({name,username, email, password: hash}).save();
    console.log("new user save huaa");
    return res.status(200).json({msg: "new user created"});
  });
});


module.exports = route;
