// js/data.js

// These variables are intentionally NOT exported. They will become global variables
// when this script runs, allowing other scripts loaded later to access them directly.

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyVmhEeVEemjYlflXvRndoz_eGJ2eE0t-yCD9GYTbBpp65B-mIjllqhhNacO7rC-0CW1Q/exec';
const WHATSAPP_PHONE_NUMBER = '923001234567'; // EXAMPLE: Make sure this is a valid Pakistani number

// --- KARACHI BOUNDARY (Simplified Polygon for Geofencing) ---
// This is an approximation. Format is [longitude, latitude]
const KARACHI_BOUNDARY = [
    [66.8, 24.8], [66.8, 25.2], [67.0, 25.4], [67.2, 25.3],
    [67.4, 25.0], [67.3, 24.7], [67.1, 24.7], [66.8, 24.8]
];

// --- DEMO PRODUCT DATA ---
// Using Picsum Photos for dynamic, high-quality placeholders.
// Adding a unique seed ensures we get the same image for the same item on refresh.
const demoProducts = [
    { id: 'burg1', name: 'Classic Zinger Burger', description: 'Crispy chicken fillet, fresh lettuce, and our special zinger sauce.', price: 550, image_url: 'https://picsum.photos/seed/zingerBurger/400/400' },
    { id: 'burg2', name: 'Mighty Beef Burger', description: 'Juicy grilled beef patty, melted cheese, onions, tomatoes, and smoky BBQ sauce.', price: 680, image_url: 'https://picsum.photos/seed/beefBurger/400/400' },
    { id: 'fries1', name: 'Large Crispy Fries', description: 'Golden, perfectly salted, and irresistibly crispy.', price: 250, image_url: 'https://picsum.photos/seed/crispyFries/400/400' },
    { id: 'drink1', name: 'Creamy Chocolate Shake', description: 'Rich, cold, and indulgent chocolate milkshake.', price: 320, image_url: 'https://picsum.photos/seed/chocoShake/400/400' },
    { id: 'pizza1', name: 'Chicken Tikka Pizza Slice', description: 'Spicy chicken tikka, onions, and capsicum on a mini pizza base.', price: 380, image_url: 'https://picsum.photos/seed/pizzaSlice/400/400' },
    { id: 'sandwich1', name: 'Grilled Chicken Sandwich', description: 'Tender grilled chicken, fresh veggies, and a tangy sauce in toasted bread.', price: 490, image_url: 'https://picsum.photos/seed/chickSandwich/400/400' },
    { id: 'roll1', name: 'Spicy Seekh Kabab Roll', description: 'Succulent seekh kababs wrapped in fresh paratha with mint chutney.', price: 420, image_url: 'https://picsum.photos/seed/kababRoll/400/400' }
];

// --- DEMO DEAL DATA for Hero Slider ---
const demoDeals = [
    { id: 'deal1', title: 'Super Saver Meal', description: 'Get 2 Classic Zinger Burgers, 1 Large Crispy Fries, and 2 Creamy Chocolate Shakes.', serving: '2-3 people', price: 1500, image_url: 'https://picsum.photos/seed/dealCombo1/800/600' },
    { id: 'deal2', title: 'Family Feast', description: 'Includes 4 Mighty Beef Burgers, 2 Large Fries, and a 1.5L Drink.', serving: '4-5 people', price: 2500, image_url: 'https://picsum.photos/seed/dealCombo2/800/600' },
    { id: 'deal3', title: 'Snack Attack', description: '1 Chicken Tikka Pizza Slice, 1 Spicy Seekh Kabab Roll, and a small cold drink.', serving: '1 person', price: 750, image_url: 'https://picsum.photos/seed/dealCombo3/800/600' }
];
