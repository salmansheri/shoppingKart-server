import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import user from "./routes/user.js";
import auth from "./routes/auth.js";
import product from "./routes/product.js";
import cart from "./routes/cart.js";
import order from './routes/order.js';
import stripe from './routes/stripe.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
mongoose.set("strictQuery", true);
const port = process.env.PORT;

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => console.log("Database connection established successfully"))
  .catch((err) => console.log(`Error message: ${err.message}`));

app.use("/user", user);
app.use("/auth", auth);
app.use("/products", product);
app.use("/cart", cart);
app.use("/order", order);
app.use("/api/checkout/", stripe);
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
