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


route.post("/sign-in", async (req, res) => {
  const {email, password} = req.body;
  const isExist = await userModel.findOne({email});
  if (!isExist) {
    console.log("this user is not avalable");
    return res.status(404).json({msg: "invlaid access"});
  }
  bcrypt.compare(password, isExist.password, (err, result) => {
    if (result) {
      console.log("user login ho gya");
      var token = jwt.sign({user: isExist._id}, "shhh");
      res.cookie("tokenn", token).status(202).json({msg: "login successfully", user: isExist});
    } else {
      console.log("password galat hai bhai");
      return res.status(404).json({msg: "invlaid access"});
    }
  });
});

route.post("/posts", authCheck, async (req, res) => {
  const findUser = await userModel.findById(req.userID.user);
  const {edit} = req.body;
  if (!edit) {
    return res.status(404).json({user: findUser, msg: "fill the post"});
  }
  const newPost = await postModel({post: edit, user: findUser._id});
  await newPost.save();
  findUser.posts.push(edit);
  await findUser.save();
  res.status(200).json({user: findUser, msg: "post created"});
});

route.get("/all-posts", async (req, res) => {
  const allPosts = await postModel.find().populate("user");
  res.status(200).json(allPosts);
});

function authCheck(req, res, next) {
  const token = req.cookies.tokenn;
  if (!token) {
    return res.status(404).json({msg: "unauthorized! please login first"});
  }
  const user = jwt.verify(token, "shhh");
  req.userID = user;
  next();
}


module.exports = route;
