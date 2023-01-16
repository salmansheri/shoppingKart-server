import express from "express";
import cartModel from "../models/cartModel.js";
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from "./verifyToken.js";

const router = express.Router();

/* CREATE */
router.post("/", verifyToken, async (req, res) => {
  try {
    const newCart = new cartModel(req.body);
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* UPDATE */
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await cartModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* DELETE */
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const deletedCart = await cartModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Item deleted successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
});

/* GET USER CART */
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const getCart = await cartModel.findOne({ userId: req.params.userId });
    res.status(200).json(getCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* GET ALL USER CART */
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const getAllCart = await cartModel.find();
    res.status(200).json(getAllCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
