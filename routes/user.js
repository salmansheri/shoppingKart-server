import express, { response } from "express";
import CryptoJS from "crypto-js";
import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "./verifyToken.js";
import userModel from "../models/userModel.js";

const router = express.Router();

/* UPDATE USER */
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      res.body.password,
      process.env.SECRET_KEY
    ).toString();
  }
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* DELETE USER */
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User Deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const getUser = await userModel.findById(req.params.id);
    const { password, ...others } = getUser._doc;

    res.status(200).json(others);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL USERS */
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const getAllUsers = query
      ? await userModel.find().sort({ _id: -1 }).limit(5)
      : await userModel.find();
    res.status(200).json(getAllUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET USER STATS */
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await userModel.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
