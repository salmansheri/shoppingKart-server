import express from "express";
import productModel from "../models/productModel.js";
import { verifyToken, verifyTokenAndAdmin } from "./verifyToken.js";

const router = express.Router();

/* CREATE */
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new productModel(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* UPDATE */
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* DELETE */
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
    res.status(200).json("product has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

/* GET PRODUCTS */
router.get("/find/:id", async (req, res) => {
  try {
    const getProduct = await findById(req.params.id);
    res.status(200).json(getProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* GET ALL PRODUCTS */
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await productModel.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await productModel.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await productModel.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
