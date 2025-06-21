// admin.js - FINAL, CORRECTED VERSION

document.addEventListener('DOMContentLoaded', () => {
    // Access global variables from data.js
    const API_URL = 'https://script.google.com/macros/s/AKfycbzB1Deeqz2V8kXnnFNBbqO_anyLB3afPDGYrNRijBWf50Lu8kZA-KHAH3tnuRj0WFCH/exec';

    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const refreshStatsBtn = document.getElementById('refresh-stats-btn');
    const productListContainer = document.getElementById('product-management-list');
    
    // --- Authentication Logic ---
    // Check if we are already logged in (password stored in sessionStorage)
    if (sessionStorage.getItem('adminPassword')) {
        // If logged in, immediately try to load dashboard data
        loadDashboardData();
    }

    // Handle the login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form from reloading the page
        const password = passwordInput.value;
        if (!password) {
            loginError.textContent = "Password cannot be empty.";
            return;
        }
        // Attempt to log in by fetching data
        loginAndLoadData(password);
    });
    
    async function loginAndLoadData(password) {
        loginError.textContent = "Logging in..."; // Provide feedback
        
        // We will test the password by trying to fetch the summary.
        // The API will return an "Authentication Failed" error if the password is wrong.
        const summary = await apiRequest('getDailySummary', {}, password);

        if (summary) { // If apiRequest was successful and returned data
            sessionStorage.setItem('adminPassword', password); // Save the correct password
            loginScreen.classList.add('hidden');
            dashboard.classList.remove('hidden');
            loginError.textContent = "";
            // Now load the rest of the data
            populateDashboard(summary);
            loadAdminProducts();
        } else {
            // apiRequest would have already shown an alert, but we can clear the status
            loginError.textContent = "Login failed. Please check the password.";
        }
    }

    // --- Dashboard Data Loading ---
    async function loadDashboardData() {
        const summary = await apiRequest('getDailySummary');
        if (summary) {
            populateDashboard(summary);
            loadAdminProducts();
        }
    }

    function populateDashboard(summary) {
        document.getElementById('stats-visits').textContent = summary.totalVisits;
        document.getElementById('stats-carts').textContent = summary.totalCarts;
        document.getElementById('stats-orders').textContent = summary.totalOrders;
        renderProductChart(summary.productCounts);
    }
    
    async function loadAdminProducts() {
        // ... (product loading logic remains the same)
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
    async function apiRequest(action, payload = {}, explicitPassword = null) {
        // Use the explicit password if provided (for login attempt), otherwise use sessionStorage
        const password = explicitPassword || sessionStorage.getItem('adminPassword');
        
        if (!password) {
            // This case should only happen if the session is cleared and code tries to run
            logout();
            return undefined;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, password, payload }),
                redirect: 'follow'
            });

            // Check for network errors
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            if (result.status === 'error') {
                throw new Error(result.message);
            }
            return result.data; // Return the 'data' part of the successful response
        } catch (error) {
            console.error('API Error:', error);
            loginError.textContent = `Error: ${error.message}`; // Display error on login screen
            if (error.message === "Authentication Failed") {
                logout(); // Logout if password is wrong
            }
            return undefined; // Return undefined on failure
        }
    }

    // --- Logout ---
    logoutBtn.addEventListener('click', logout);
    function logout() {
        sessionStorage.removeItem('adminPassword');
        dashboard.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        passwordInput.value = '';
        loginError.textContent = '';
    }

    refreshStatsBtn.addEventListener('click', loadDashboardData);
});
