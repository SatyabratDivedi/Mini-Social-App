const express = require("express");
const route = express();
const bcrypt = require("bcrypt");
const userModel = require("../models/userSchema");
const postModel = require("../models/postSchema");
var jwt = require("jsonwebtoken");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/image");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});
const upload = multer({storage: storage});

route.post("/upload", authCheck, upload.single("image"), async (req, res) => {
  const edit = req.body.edit;
  const findUser = await userModel.findById(req.userID.user);
  if (!edit && !req.file) {
    return res.status(400).json({msg: "please add post or upload image"});
  }
  if (edit && !req.file) {
    const newPost = await postModel({post: edit, imagePath: "", user: findUser._id});
    await newPost.save();
    console.log("post created", newPost);
    findUser.posts.push(edit);
    await findUser.save();
    return res.status(200).json({msg: "post created"});
  } else if (edit == "undefined" && req.file) {
    const newPost = await postModel({post: "", imagePath: req.file.filename, user: findUser._id});
    await newPost.save();
    console.log("image saved", newPost);
    findUser.posts.push(edit);
    await findUser.save();
    return res.status(200).json({msg: "image uploaded"});
  } else {
    const newPost = await postModel({post: edit, imagePath: req.file.filename, user: findUser._id});
    await newPost.save();
    console.log("image and post created", newPost);
    findUser.posts.push(edit);
    await findUser.save();
    return res.status(200).json({msg: "image and post uploded"});
  }
});

route.post("/posts", authCheck, async (req, res) => {
  const findUser = await userModel.findById(req.userID.user);
  res.status(200).json({user: findUser, msg: "post created"});
});

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
    const username = name + Math.floor(Math.random() * 1000).toString();
    await userModel({name, username, email, password: hash}).save();
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

route.get("/logout", (req, res)=>{
  console.log('logout')
 return res.cookie("tokenn", '').status(200).json({msg: "logout successfully"});
})

route.get("/all-posts", async (req, res) => {
  const allPosts = await postModel.find().populate("user");
  res.status(200).json(allPosts);
});

route.post("/like-post/:id", authCheck, async (req, res) => {
  const findPost = await postModel.findById(req.params.id);
  if (findPost.liked.includes(req.userID.user)) {
    findPost.liked = findPost.liked.filter((id) => id != req.userID.user);
    console.log("unlilked", findPost);
    await findPost.save();
    return res.status(202).json({user: req.userID.user, msg: "unliked"});
  }
  findPost.liked.push(req.userID.user);
  await findPost.save();
  console.log("liked", findPost);
  res.status(200).json("liked successfully");
});

route.delete("/delete-post/:id", authCheck, async (req, res) => {
  const deletePost = await postModel.findByIdAndDelete(req.params.id);
  console.log("delet huaa", deletePost);
  res.status(200).json({msg: "post deleted successfully"});
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
