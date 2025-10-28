import express from "express"
import mongoose from "mongoose";
import cors from "cors"
import { configDotenv } from "dotenv";
import CartModel from "./models/Cart.js";
import products from "./data/products.js";

configDotenv({ quiet: true })

const app = express()
const PORT = 5000;
app.use(cors())
app.use(express.json())

// console.log(process.env.MONGODB_URL)
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to Mongo"))
  .catch((err) => console.log("Error connecting to Mongo: ", err))


app.get("/api/products", (req, res) => {
    res.json(products)
})

app.post("/api/cart", async (req, res) => {
    const { cartId, items, prodId, qty } = req.body
    try {
                
        let cart = await CartModel.findOne({ cartId });
        if (!cart) {
            cart = new CartModel({ cartId, items: [], total: 0})
        }
        
        
        if (Array.isArray(items)) {
            cart.items = items.filter((i) => i.qty > 0);
        }
        else if (prodId) {
            const product = products.find((p) => p.id == prodId);
            if (!product) return res.status(404).json({ error: "Product not found" })
            const prodIdStr = String(prodId);
            const existItem = cart.items.find((i) => String(i.productId) === prodIdStr);

            if (existItem) {
                existItem.qty += qty;
            } else {
                cart.items.push({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    qty,
                });
            }
        }

        cart.items = cart.items.filter((i) => i.qty > 0);        
        cart.total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0)
        
        await cart.save();
        res.json(cart)
    } catch (err) {
        res.status(500).json({ message: "Error adding items", error: err.message })
    }
})

app.delete("/api/cart/:id", async (req, res) => {
    const { cartId } = req.query
    const { id } = req.params

    if (!cartId) {
      return res.status(400).json({ message: "Missing cartId" });
    }

    try {
        let cart = await CartModel.findOne({ cartId })
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter((item) => item.productId != id);
        const total = cart.total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);

        await cart.save();
        res.json({ message: "Item removed", cart, total });
    } catch (err) {
        res.status(500).json({ message: "Error deleting items", error: err.message })
    }
})

app.get("/api/cart", async (req, res) => {
    const { cartId } = req.query
    try {
        const cart = await CartModel.findOne({ cartId })
        return res.json(cart || { items: [], total: 0 })
    } catch (err) {
        res.status(500).json({ message: "Error getting cart", error: err.message })
    }
})

app.post("/api/checkout", async (req, res) => {
  try {
    const { cartId, name, email } = req.body;

    if (!cartId || !name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const cart = await CartModel.findOne({ cartId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const receipt = {
      name,
      email,
      cartId,
      items: cart.items,
      total,
      timestamp: new Date().toISOString(),
      orderId: Math.random().toString(36).substring(2, 10).toUpperCase(),
      message: "Mock checkout successful — no payment processed.",
    };

    // await CartModel.deleteOne({ cartId });

    res.json(receipt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Checkout failed", error: err.message });
  }
});


app.listen(PORT, () => console.log(`Server started on port ${PORT}`))