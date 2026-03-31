// frontend/js/api.js
const API_URL = "http://localhost:5000/api";

// Fetching products for menu.html
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        renderProducts(products);
    } catch (err) {
        console.error("Failed to load products", err);
    }
}

// Rendering Logic
function renderProducts(products) {
    const container = document.getElementById('food-grid');
    container.innerHTML = products.map(item => `
        <div class="food-card">
            <img src="${item.image}" alt="${item.title}" style="width:100%; border-radius:15px;">
            <h3>${item.title}</h3>
            <p>$${item.price}</p>
            <button class="btn-primary" onclick="addToCart('${item._id}')">Add to Cart</button>
        </div>
    `).join('');
}

// Cart System (localStorage)
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Added to cart!");
}