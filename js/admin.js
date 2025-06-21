// admin.js - Full Login and Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    // Access global variables from data.js
    const API_URL = GOOGLE_APPS_SCRIPT_URL;

    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const refreshStatsBtn = document.getElementById('refresh-stats-btn');
    
    // --- Authentication Logic ---
    if (sessionStorage.getItem('adminPassword')) {
        loadDashboardData();
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = passwordInput.value;
        if (!password) {
            loginError.textContent = "Password cannot be empty.";
            return;
        }
        loginAndLoadData(password);
    });
    
    async function loginAndLoadData(password) {
        loginError.textContent = "Logging in...";
        // We will test the password by trying to fetch the summary via POST.
        const summary = await apiRequest('getDailySummary', {}, password);

        if (summary) { // If apiRequest was successful and returned data
            sessionStorage.setItem('adminPassword', password);
            loginScreen.classList.add('hidden');
            dashboard.classList.remove('hidden');
            loginError.textContent = "";
            // Now load the rest of the data
            populateDashboard(summary);
            // loadAdminProducts(); // You can uncomment this when ready
        } else {
            // apiRequest would have already shown an alert, but we can clear the status
            loginError.textContent = "Login failed. Please check the password or console for errors.";
        }
    }

    // --- Dashboard Data Loading ---
    async function loadDashboardData() {
        const summary = await apiRequest('getDailySummary');
        if (summary) {
            loginScreen.classList.add('hidden');
            dashboard.classList.remove('hidden');
            populateDashboard(summary);
            // loadAdminProducts();
        }
    }

    function populateDashboard(summary) {
        document.getElementById('stats-visits').textContent = summary.totalVisits;
        document.getElementById('stats-carts').textContent = summary.totalCarts;
        document.getElementById('stats-orders').textContent = summary.totalOrders;
        renderProductChart(summary.productCounts);
    }
    
    // async function loadAdminProducts() { /* ... product loading logic ... */ }

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
                    backgroundColor: 'rgba(102, 252, 241, 0.5)',
                    borderColor: 'rgba(102, 252, 241, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#E0E0E0' } },
                    x: { ticks: { color: '#E0E0E0' } }
                },
                plugins: { legend: { labels: { color: '#E0E0E0' } } }
            }
        });
    }
    
    // --- API Request Helper for POST requests ---
    async function apiRequest(action, payload = {}, explicitPassword = null) {
        const password = explicitPassword || sessionStorage.getItem('adminPassword');
        
        if (!password && action !== 'getProducts' && action !== 'logStat' && action !== 'logOrder') {
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

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.status === 'error') {
                throw new Error(result.message);
            }
            return result.data;
        } catch (error) {
            console.error('API Error:', error);
            if (explicitPassword) {
                loginError.textContent = `Error: ${error.message}`;
            } else {
                alert(`API Error: ${error.message}`);
            }
            if (error.message === "Authentication Failed") {
                logout();
            }
            return undefined;
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
