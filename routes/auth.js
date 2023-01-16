import express from "express";
import userModel from "../models/userModel.js";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();
import jwt from 'jsonwebtoken';

const router = express.Router();

/* Register */
router.post("/register", async (req, res) => {
  const newUser = new userModel({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });

  try {
    await newUser.save();
    res.status(200).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* Login */

router.post("/login", async (req, res) => {
  try {
    const user = await userModel.findOne({
      username: req.body.username,
    });

    !user && res.status(401).json({ message: "Wrong username" });
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    );

    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    OriginalPassword !== req.body.password &&
      res.status(401).json({ message: "Wrong password" });

      const accessToken = jwt.sign({
        id: user._id, 
        isAdmin: user.isAdmin,
      }, process.env.JWT_SEC, {expiresIn: "3d"})

    const { password, ...others } = user._doc; 

    res.status(200).json({...others, accessToken});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
