// Library
import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import passport from "passport";

// Models
import { UserModel } from "../../database/user/index";

//validation
import { ValidateSignup, ValidateSignin } from "../../validation/auth";

const Router = express.Router();

/*
Route           /auth/signup
Desc            Register new user
Params          none
Access          Public
Method          POST
*/

Router.post("/signup", async (req, res) => {
  try {
  //   const {email, password, fullName, phoneNumber} = req.body.credentials;
  //   const checkUserByEmail = await UserModel.findOne({ email });
  //   const checkUserByPhone = await UserModel.findOne({ phoneNumber });

  //   //check whether email exists
  //   if(checkUserByEmail || checkUserByPhone) {
  //     return res.json({email: "User already exists........!"})
  //   }

  //   //hash password
  //   const bcryptSalt = await bcrypt.genSalt(8);
  //   const hashedPassword = await bcrypt.hash(password, bcryptSalt);

  //   //save to db
  //   await UserModel.create({
  //     ...req.body.credentials,
  //     password : hashedPassword
  //   })
  //   //generate JWT auth token
  //   const token = jwt.sign({user: {fullName, email}}, "ZomatoApp");
  //   return res.status(200).json({token, status: "success"});
  // } catch(error) {
  //   return res.status(500).json({error: error.message})
  // }




     await ValidateSignup(req.body.credentials);
     await UserModel.findByEmailAndPhone(req.body.credentials);
     const newUser = await UserModel.create(req.body.credentials);
     const token = newUser.generateJwtToken();
     return res.status(200).json({ token, status: "success" });
   } catch (error) {
     return res.status(500).json({ error: error.message });
   }
});


Router.post("/signup", async (req, res) => {
  try {
    await ValidateSignup(req.body.credentials);
    await UserModel.findByEmailAndPhone(req.body.credentials);
    const newUser = await UserModel.create(req.body.credentials);
    const token = newUser.generateJwtToken();
    return res.status(200).json({ token, status: "success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Route           /auth/signin
Desc            Signin with email and password
Params          none
Access          Public
Method          POST
*/
Router.post("/signin", async (req, res) => {
  try {
    await ValidateSignin(req.body.credentials);
    const user = await UserModel.findByEmailAndPassword(req.body.credentials);
    const token = user.generateJwtToken();
    return res.status(200).json({ token, status: "success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Route           /auth/google
Desc            route for google authentication
Params          none
Access          Public
Method          GET
*/
Router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

/*
Route           /auth/callback
Desc            google callback function
Params          none
Access          Public
Method          GET
*/
Router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    return res.redirect(
      `http://localhost:3000/google/${req.session.passport.user.token}`
    );
  }
);

export default Router;
