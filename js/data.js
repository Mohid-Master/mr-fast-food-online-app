// admin.js

document.addEventListener('DOMContentLoaded', () => {
    // These variables are loaded from the global scope of data.js
    // For admin, we only need the API URL, but the other data won't hurt.
    const API_URL = 'https://script.google.com/macros/s/AKfycbzB1Deeqz2V8kXnnFNBbqO_anyLB3afPDGYrNRijBWf50Lu8kZA-KHAH3tnuRj0WFCH/exec';
    const CLOUDINARY_CLOUD_NAME = "YOUR_CLOUD_NAME"; // Replace with your Cloudinary cloud name
    const CLOUDINARY_UPLOAD_PRESET = "mr_food_preset"; // The unsigned preset you created

    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('dashboard');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    
    // Check if password is saved in session storage
    if (sessionStorage.getItem('adminPassword')) {
        loginScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        loadDashboardData();
    }

    loginBtn.addEventListener('click', () => {
        const password = passwordInput.value;
        if (!password) {
            loginError.textContent = "Password cannot be empty.";
            return;
        }
        // Save password to session storage for this session
        sessionStorage.setItem('adminPassword', password);
        loginScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        loadDashboardData();
    });
    
    // --- Dashboard Logic ---
    function loadDashboardData() {
        apiRequest('getDailySummary').then(summary => {
            // **FIXED:** Guard clause to prevent error if API fails
            if (!summary) {
                console.error("Failed to load daily summary. API might have failed.");
                return;
            }
            document.getElementById('stats-visits').textContent = summary.totalVisits;
            document.getElementById('stats-carts').textContent = summary.totalCarts;
            document.getElementById('stats-orders').textContent = summary.totalOrders;
            renderProductChart(summary.productCounts);
        });

        // Fetch products for management
        // You would implement the rest of the product management UI logic here
        // using the 'getAllProductsForAdmin' action.
    }

    let productChartInstance;
    function renderProductChart(productData) {
        if (productChartInstance) {
            productChartInstance.destroy(); // Destroy old chart before creating new one
        }
        const ctx = document.getElementById('product-chart').getContext('2d');
        const labels = Object.keys(productData);
        const data = Object.values(productData);
        
        productChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '# of Times Added to Cart',
                    data: data,
                    backgroundColor: 'rgba(231, 76, 60, 0.5)',
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#fff' } },
                    x: { ticks: { color: '#fff' } }
                },
                plugins: { legend: { labels: { color: '#fff' } } }
            }
        });
    }
    
    // --- API Request Helper ---
    async function apiRequest(action, payload = {}) {
        const password = sessionStorage.getItem('adminPassword');
        if (!password) {
            alert("Session expired. Please log in again.");
            logout();
            return; // Return explicitly
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                // mode: 'cors', // No longer needed with server-side headers
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, password, payload }),
                redirect: 'follow'
            });
            const result = await response.json();

            if (result.status === 'error') {
                throw new Error(result.message);
            }
            return result.data; // Return the 'data' part of the successful response
        } catch (error) {
            console.error('API Error:', error);
            alert(`An error occurred: ${error.message}`);
            if (error.message === "Authentication Failed") {
                logout();
            }
            return undefined; // Return undefined on failure
        }
    }

    // --- Logout ---
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', logout);
    function logout() {
        sessionStorage.removeItem('adminPassword');
        dashboard.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        passwordInput.value = '';
    }

    // You would add other event listeners for product management here...
});