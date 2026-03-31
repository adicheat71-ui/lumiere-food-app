const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Ye zaroori hai taaki Frontend aur Backend connect ho sakein

// MongoDB Connection (Apna URI yahan daalein)
const MONGO_URI = "mongodb://localhost:27017/lumiere_db"; 

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected: Lumiere Database Ready"))
    .catch(err => console.log("❌ Connection Error:", err));

// --- PRODUCT SCHEMA ---
const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    image: String,
    category: String
});

const Product = mongoose.model('Product', productSchema);

// --- ROUTES ---

app.get('/', (req, res) => {
    res.send("Lumière Server is Running Successfully!");
});

// 1. Get all products (Menu ke liye)
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// 2. Add a product (Admin ke liye)
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: "Product added!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add product" });
    }
});

// 3. Delete a product (Admin ke liye)
app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted!" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));