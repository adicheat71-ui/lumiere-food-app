// admin.js - Handling Premium Admin Dashboard Logic

const API_URL = "http://localhost:5000/api";

// 1. PAGE PROTECTOR (Security)
// Agar user logged in nahi hai ya admin nahi hai, toh bhaga do
function checkAdmin() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || user.role !== 'admin' || !token) {
        alert("⚠️ Access Denied. Admins Only!");
        window.location.href = "login.html";
    }
}

// 2. FETCH & RENDER PRODUCTS
async function loadDashboardData() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();

        // Update Stats
        document.getElementById('total-prods').innerText = products.length;

        const tableBody = document.getElementById('admin-product-list');
        tableBody.innerHTML = ""; // Clear existing

        products.forEach(product => {
            const row = `
                <tr>
                    <td><img src="${product.image}" class="prod-img-sm" alt="food"></td>
                    <td>${product.title}</td>
                    <td><span class="badge" style="border: 1px solid #555; color: #aaa;">${product.category}</span></td>
                    <td class="accent-text" style="font-weight:600;">$${product.price}</td>
                    <td class="action-btns">
                        <button class="btn-edit" onclick="editProduct('${product._id}')">
                            <i data-lucide="edit-3"></i>
                        </button>
                        <button class="btn-delete" onclick="deleteProduct('${product._id}')">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // Re-initialize icons for dynamic content
        lucide.createIcons();

    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// 3. ADD NEW PRODUCT
const addForm = document.getElementById('add-product-form');
if (addForm) {
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token'); // JWT Token from login
        const productData = {
            title: document.getElementById('p-title').value,
            category: document.getElementById('p-category').value,
            price: document.getElementById('p-price').value,
            image: document.getElementById('p-image').value
        };

        try {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token // Sending token for backend security
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                alert("✨ Product Added to Lumière Menu!");
                toggleModal(false); // Close Modal
                addForm.reset();    // Clear Form
                loadDashboardData(); // Refresh Table
            } else {
                const err = await response.json();
                alert("Error: " + err.message);
            }
        } catch (error) {
            alert("Backend server not responding.");
        }
    });
}

// 4. DELETE PRODUCT
async function deleteProduct(id) {
    const token = localStorage.getItem('token');
    
    if (confirm("Are you sure you want to remove this item?")) {
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (response.ok) {
                loadDashboardData(); // Refresh list
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();
    loadDashboardData();
});