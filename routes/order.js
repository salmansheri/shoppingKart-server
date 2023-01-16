import express from "express";
import {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
} from "./verifyToken";
import orderModel from "../models/orderModel.js";

const router = express.Router();

/* CREATE */
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new orderModel(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* UPDATE */
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* DELETE */
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedOrder = await orderModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Order Deleted Successfully!...");
  } catch (err) {
    res.status(500).json(err);
  }
});

/* GET USER ORDER */
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const getUserOrder = await orderModel.find({ userId: req.params.id });
    res.status(200).json(getUserOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* GET ALL ORDERS */
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const getAllUserOrders = await orderModel.find();
    res.status(200).json(getAllUserOrders);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* USER STATS */
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await orderModel.aggregate([
      {
        $match: { createdAt: { $gte: previousMonth } },
      },
      {
        $project: {
          month: { $month: "$createAt" },
          sales: "$amount",
        },
      },
      {
        group: {
          _id: "$month",
          total: { $sum: $sales },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});
/* */
/* */

export default router;
