// js/App.js

const App = (function() {
    // --- DOM Elements ---
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNavLinks = document.querySelector('.main-nav .nav-links');
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    const themeSwitcher = document.querySelector('.theme-switcher');

    const productList = document.getElementById('product-list');
    const loadingMessage = productList.querySelector('.loading-message');
    const menuSearchInput = document.getElementById('menu-search');
    const shopStatusBanner = document.getElementById('shop-status-banner');

    // Hero Slider elements
    const heroSlider = document.getElementById('hero-slider');
    const sliderDotsContainer = document.getElementById('slider-dots');

    // Cart Sidebar elements
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeSidebarBtn = document.querySelector('.close-sidebar-btn');
    const sidebarCartList = document.getElementById('sidebar-cart-list');
    const sidebarCartTotalPrice = document.getElementById('sidebar-cart-total-price');
    const sidebarClearCartBtn = document.getElementById('sidebar-clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Checkout Modal elements
    const checkoutModalOverlay = document.getElementById('checkout-modal-overlay');
    const closeCheckoutModalBtn = document.querySelector('.close-modal-btn');
    const orderForm = document.getElementById('order-form');
    const userNameInput = document.getElementById('userName');
    const userPhoneInput = document.getElementById('userPhone');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const userLocalityInput = document.getElementById('userLocality');
    const userAddressInput = document.getElementById('userAddress');
    const getGpsBtn = document.getElementById('getGpsBtn');
    const gpsCoordsSpan = document.getElementById('gps-coords');
    const gpsStatusParagraph = document.getElementById('gps-status');
    const deliveryTimeSelect = document.getElementById('deliveryTime');
    const placeOrderBtn = document.querySelector('.place-order-btn');

    // --- State Variables ---
    let cart = JSON.parse(localStorage.getItem('mrFoodCart')) || [];
    let userDetails = JSON.parse(localStorage.getItem('mrFoodUserDetails')) || {};
    let isShopOpen = false;
    let isLocationInKarachi = false; // Flag for GPS check

    // --- Theme Configurations ---
    const themes = [
        'dark-red-orange-theme',
        'light-yellow-red-theme',
        'mid-bluish-greenish-yellow-neon-theme',
        'dark-neon-theme'
    ];
    let currentThemeIndex = localStorage.getItem('mrFoodThemeIndex') ? parseInt(localStorage.getItem('mrFoodThemeIndex')) : 0;

    // --- Hero Slider Variables ---
    let currentSlide = 0;
    let sliderInterval;
    const SLIDER_INTERVAL_TIME = 5000;

    // --- Constants ---
    const SHOP_OPEN_HOUR = 18; // 7 PM
    const SHOP_CLOSE_HOUR = 26; // 02 AM

    // --- Utility Functions ---
    function formatPrice(price) {
        return `Rs. ${price.toLocaleString('en-PK')}`;
    }

    // --- Theme Management ---
    function applyTheme(index) {
        themes.forEach(themeClass => body.classList.remove(themeClass));
        body.classList.add(themes[index]);
        localStorage.setItem('mrFoodThemeIndex', index);
        currentThemeIndex = index;
    }

    function toggleTheme() {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        applyTheme(currentThemeIndex);
    }

    // --- Shop Timings Logic ---
    function checkShopStatus() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentTimeInMinutes = (currentHour * 60) + now.getMinutes();
        const openTimeInMinutes = SHOP_OPEN_HOUR * 60;
        const closeTimeInMinutes = SHOP_CLOSE_HOUR * 60;

        if (currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes) {
            isShopOpen = true;
            shopStatusBanner.textContent = 'We are OPEN! Order now for delicious food!';
            shopStatusBanner.classList.remove('closed');
            shopStatusBanner.classList.add('open');
            enableOrdering();
        } else {
            isShopOpen = false;
            const openTimeFormatted = `${SHOP_OPEN_HOUR % 12 || 12}:00 PM`;
            const closeTimeFormatted = `${SHOP_CLOSE_HOUR % 12 || 12}:00 AM`;
            shopStatusBanner.textContent = `We are currently CLOSED. Open everyday from ${openTimeFormatted} to ${2,00 AM}.`;
            shopStatusBanner.classList.remove('open');
            shopStatusBanner.classList.add('closed');
            disableOrdering();
        }
    }

    function disableOrdering() {
        document.querySelectorAll('.add-to-cart-btn, .add-to-cart-deal-btn, .checkout-btn, .place-order-btn').forEach(btn => {
            btn.disabled = true;
            if(btn.classList.contains('checkout-btn') || btn.classList.contains('place-order-btn')) {
                btn.textContent = 'Shop Closed';
            }
        });
    }

    function enableOrdering() {
        document.querySelectorAll('.add-to-cart-btn, .add-to-cart-deal-btn').forEach(btn => btn.disabled = false);
        document.querySelector('.checkout-btn').textContent = 'Proceed to Checkout';
        document.querySelector('.place-order-btn').textContent = 'Place Order via WhatsApp';
        if (cart.length > 0) {
            document.querySelector('.checkout-btn').disabled = false;
            document.querySelector('.place-order-btn').disabled = false;
        }
    }

    // --- Navigation ---
    function setupNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const bannerHeight = shopStatusBanner.offsetHeight;

                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - headerHeight - bannerHeight - 10,
                        behavior: 'smooth'
                    });
                }
                if (mainNavLinks.classList.contains('open')) {
                    mainNavLinks.classList.remove('open');
                    hamburgerMenu.classList.remove('open');
                }
            });
        });

        hamburgerMenu.addEventListener('click', () => {
            mainNavLinks.classList.toggle('open');
            hamburgerMenu.classList.toggle('open');
        });
    }

    // --- Cart & Deal Handlers (Defined before they are used) ---
    function handleAddToCart(event) {
        if (!isShopOpen) {
            alert('The shop is currently closed. Please check back during opening hours.');
            return;
        }
        const { id, name, price } = event.target.dataset;
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price: parseFloat(price), quantity: 1 });
        }
        saveCart();
        if (typeof gsap !== 'undefined') {
            gsap.to(cartIcon, { scale: 1.2, yoyo: true, repeat: 1, duration: 0.2, ease: "power2.out" });
        }
    }

    function handleAddDealToCart(event) {
        if (!isShopOpen) {
            alert('The shop is currently closed. Please check back during opening hours.');
            return;
        }
        const { id, name, price, description } = event.target.dataset;
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price: parseFloat(price), quantity: 1, description });
        }
        saveCart();
        if (typeof gsap !== 'undefined') {
            gsap.to(cartIcon, { scale: 1.2, yoyo: true, repeat: 1, duration: 0.2, ease: "power2.out" });
        }
        alert(`"${name}" added to cart!`);
    }

    // --- Hero Slider ---
    function renderHeroSlider() {
        heroSlider.innerHTML = '';
        sliderDotsContainer.innerHTML = '';

        demoDeals.forEach((deal, index) => {
            const dealCard = document.createElement('div');
            dealCard.classList.add('deal-card');
            dealCard.style.backgroundImage = `url('${deal.image_url || 'assets/images/placeholder-deal.jpg'}')`;
            dealCard.innerHTML = `
                <div class="deal-card-overlay">
                    <div class="deal-content">
                        <h2 class="deal-title">${deal.title}</h2>
                        <p class="deal-description">${deal.description}</p>
                        <div class="deal-serving">Serves: ${deal.serving}</div>
                        <div class="deal-price">${formatPrice(deal.price)}</div>
                        <button class="btn btn-primary add-to-cart-deal-btn" 
                                data-id="${deal.id}" 
                                data-name="${deal.title}" 
                                data-price="${deal.price}"
                                data-description="${deal.description}">Order This Deal</button>
                    </div>
                </div>
            `;
            heroSlider.appendChild(dealCard);

            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = index;
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetSliderInterval();
            });
            sliderDotsContainer.appendChild(dot);
        });

        goToSlide(currentSlide);
        startSlider();
        
        document.querySelectorAll('.add-to-cart-deal-btn').forEach(button => {
            button.addEventListener('click', handleAddDealToCart);
        });
    }

    function goToSlide(index) {
        if (typeof gsap !== 'undefined') {
            gsap.to(heroSlider, {
                x: -index * 100 + '%', duration: 0.8, ease: "power2.inOut",
                onComplete: () => {
                    currentSlide = index;
                    updateSliderDots();
                    if(window.animateDealOnSlideChange) window.animateDealOnSlideChange(index);
                }
            });
        } else {
            heroSlider.style.transform = `translateX(-${index * 100}%)`;
            currentSlide = index;
            updateSliderDots();
        }
    }

    function updateSliderDots() {
        document.querySelectorAll('.slider-dots .dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % demoDeals.length;
        goToSlide(currentSlide);
    }

    function startSlider() {
        if (sliderInterval) clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, SLIDER_INTERVAL_TIME);
    }

    function resetSliderInterval() {
        clearInterval(sliderInterval);
        startSlider();
    }

    // --- Product Menu & Search ---
    function displayProducts(productsToDisplay) {
        productList.innerHTML = '';
        if (productsToDisplay.length === 0) {
            productList.innerHTML = '<p class="empty-message">No items found.</p>';
            return;
        }
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image_url || 'assets/images/placeholder.jpg'}" alt="${product.name}" class="product-image" loading="lazy">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatPrice(product.price)}</div>
                <button class="btn btn-secondary add-to-cart-btn" 
                        data-id="${product.id}" 
                        data-name="${product.name}" 
                        data-price="${product.price}">Add to Cart</button>
            `;
            // **CRITICAL FIX:** Append to the list, not to itself
            productList.appendChild(productCard);
        });
        productList.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', handleAddToCart);
        });
        checkShopStatus();
    }

    function setupSearch() {
        menuSearchInput.addEventListener('input', () => {
            const searchTerm = menuSearchInput.value.toLowerCase();
            const filteredProducts = demoProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
            displayProducts(filteredProducts);
        });
    }

    // --- Shopping Cart ---
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none'; 
    }

    function saveCart() {
        localStorage.setItem('mrFoodCart', JSON.stringify(cart));
        updateCartCount();
        renderCartSidebar();
    }

    function clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            saveCart();
            if (cart.length === 0) closeCartSidebar();
        }
    }

    function renderCartSidebar() {
        sidebarCartList.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            sidebarCartList.innerHTML = '<li class="empty-cart-message">Your cart is empty.</li>';
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = !isShopOpen;
            cart.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.name} x ${item.quantity}</span>
                    <span>${formatPrice(item.price * item.quantity)}</span>
                `;
                sidebarCartList.appendChild(li);
                total += item.price * item.quantity;
            });
        }
        sidebarCartTotalPrice.textContent = formatPrice(total);
    }

    function openCartSidebar() {
        cartSidebar.classList.add('open');
        body.classList.add('modal-open');
        renderCartSidebar();
        if (window.openCartAnimation) window.openCartAnimation();
    }

    function closeCartSidebar() {
        cartSidebar.classList.remove('open');
        body.classList.remove('modal-open');
        if (window.closeCartAnimation) window.closeCartAnimation();
    }

    // --- Checkout Modal ---
    function openCheckoutModal() {
        if (cart.length === 0) { alert('Your cart is empty!'); return; }
        if (!isShopOpen) { alert('The shop is currently closed.'); return; }

        checkoutModalOverlay.classList.add('open');
        body.classList.add('modal-open');
        closeCartSidebar();
        loadUserDetails();
        if (window.openModalAnimation) window.openModalAnimation();
    }

    function closeCheckoutModal() {
        checkoutModalOverlay.classList.remove('open');
        body.classList.remove('modal-open');
        if (window.closeModalAnimation) window.closeModalAnimation();
    }

    // --- User Details (Pseudo-Login) ---
    function loadUserDetails() {
        if (userDetails.name) userNameInput.value = userDetails.name;
        if (userDetails.phone) userPhoneInput.value = userDetails.phone;
        if (userDetails.rememberMe) rememberMeCheckbox.checked = true;
    }

    function saveUserDetails() {
        if (rememberMeCheckbox.checked) {
            userDetails = { name: userNameInput.value, phone: userPhoneInput.value, rememberMe: true };
            localStorage.setItem('mrFoodUserDetails', JSON.stringify(userDetails));
        } else {
            localStorage.removeItem('mrFoodUserDetails');
            userDetails = {};
        }
    }

    // --- GPS Location & Validation ---
    function isPointInPolygon(point, polygon) {
        const [x, y] = point;
        let isInside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const [xi, yi] = polygon[i];
            const [xj, yj] = polygon[j];
            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) isInside = !isInside;
        }
        return isInside;
    }

    function getGpsLocation() {
        if (navigator.geolocation) {
            gpsStatusParagraph.textContent = 'Getting & Checking Location...';
            gpsStatusParagraph.style.color = '#FFC107'; // Yellow for processing
            getGpsBtn.disabled = true;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    gpsCoordsSpan.textContent = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
                    
                    if (isPointInPolygon([lon, lat], KARACHI_BOUNDARY)) {
                        isLocationInKarachi = true;
                        gpsStatusParagraph.textContent = 'Location is within Karachi! Delivery is available.';
                        gpsStatusParagraph.style.color = '#28A745'; // Green for success
                    } else {
                        isLocationInKarachi = false;
                        gpsStatusParagraph.textContent = 'Sorry, delivery is not available at your location.';
                        gpsStatusParagraph.style.color = '#DC3545'; // Red for failure
                    }
                    getGpsBtn.disabled = false;
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    let message = 'Could not get GPS location. Please allow location access or enter manually.';
                    if (error.code === error.PERMISSION_DENIED) message = 'Location access denied. Please enable it in your browser settings.';
                    gpsCoordsSpan.textContent = 'Not set';
                    gpsStatusParagraph.textContent = message;
                    getGpsBtn.disabled = false;
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            gpsCoordsSpan.textContent = 'Not supported';
            gpsStatusParagraph.textContent = 'Geolocation is not supported by your browser.';
            getGpsBtn.disabled = true;
        }
    }

    // --- WhatsApp Order Generation ---
    function generateWhatsAppMessage() {
        const name = userNameInput.value.trim();
        const phone = userPhoneInput.value.trim();
        const locality = userLocalityInput.value.trim();
        const address = userAddressInput.value.trim();
        const gps = gpsCoordsSpan.textContent;
        const deliveryTime = deliveryTimeSelect.value;

        if (cart.length === 0) { alert('Your cart is empty!'); return ''; }
        if (!name || !phone || !locality || !address) { alert('Please fill in all your details.'); return ''; }
        if (!isLocationInKarachi) {
            alert('Your location could not be verified as being within Karachi. Please use the "Get & Check My Location" button to confirm before placing an order.');
            return '';
        }

        let orderDetailsText = '';
        let total = 0;
        cart.forEach(item => {
            orderDetailsText += `- ${item.name} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}\n`;
            total += item.price * item.quantity;
        });

        const googleMapsLink = gps.includes(',') ? `https://maps.google.com/?q=${gps}` : 'N/A';

        const message = `*WEBSITE ORDER* (via Mr. Food Fast Food Online)
*Mohid's Signature: Developed by https://i-am-mohid.netlify.app/*

Hello Mr. Food Fast Food,
I'd like to place an order:

Name: ${name}
Phone: ${phone}
Locality: ${locality}
Address: ${address}
GPS: ${gps} (Link: ${googleMapsLink})
Desired Delivery Time: ${deliveryTime}

Order Details:
${orderDetailsText}
Total: ${formatPrice(total)}

Thank you!
        `;

        return encodeURIComponent(message);
    }

    function handleOrderSubmit(event) {
        event.preventDefault();
        saveUserDetails();
        const encodedMessage = generateWhatsAppMessage();
        if (encodedMessage) {
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE_NUMBER}&text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
            
            cart = [];
            saveCart();
            closeCheckoutModal();
            alert('Your order has been prepared for WhatsApp. Please send the message to confirm!');
            orderForm.reset();
            gpsCoordsSpan.textContent = 'Not set';
            gpsStatusParagraph.textContent = '';
        }
    }

    // --- Initialization ---
    function init() {
        applyTheme(currentThemeIndex);
        setupNavigation();
        renderHeroSlider();
        displayProducts(demoProducts);
        setupSearch();
        updateCartCount();
        checkShopStatus();

        themeSwitcher.addEventListener('click', toggleTheme);
        cartIcon.addEventListener('click', openCartSidebar);
        closeSidebarBtn.addEventListener('click', closeCartSidebar);
        sidebarClearCartBtn.addEventListener('click', clearCart);
        checkoutBtn.addEventListener('click', openCheckoutModal);
        closeCheckoutModalBtn.addEventListener('click', closeCheckoutModal);
        getGpsBtn.addEventListener('click', getGpsLocation);
        orderForm.addEventListener('submit', handleOrderSubmit);

        checkoutModalOverlay.addEventListener('click', (e) => {
            if (e.target === checkoutModalOverlay) closeCheckoutModal();
        });
        cartSidebar.addEventListener('click', (e) => {
            if (e.target === cartSidebar) closeCartSidebar();
        });

        setInterval(checkShopStatus, 60 * 1000); // Check shop status every minute
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
