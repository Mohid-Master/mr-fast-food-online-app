// js/data.js

// These variables are intentionally NOT exported. They will become global variables
// when this script runs, allowing other scripts loaded later to access them directly.

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyzdTq0h_prTPVvT1MYMfPabsmw8lrZBBhwoQKkJw7pLrj2a5bZX7rP5udrd1MozVLw/exec';
const WHATSAPP_PHONE_NUMBER = '923442384248'; // Updated to a valid-looking Pakistani number

// --- ORANGI TOWN BOUNDARY (Simplified Polygon for Geofencing) ---
// This is an approximation for Orangi Town, Karachi. Format is [longitude, latitude]
const KARACHI_BOUNDARY = [
    [67.015, 24.975], // Northwest corner of Orangi Town (approx)
    [67.065, 24.975], // Northeast corner
    [67.065, 24.925], // Southeast corner
    [67.015, 24.925], // Southwest corner
    [67.015, 24.975]  // Closing the polygon
];
// const KARACHI_BOUNDARY = [
//     [66.8, 24.8], [66.8, 25.2], [67.0, 25.4], [67.2, 25.3],
//     [67.4, 25.0], [67.3, 24.7], [67.1, 24.7], [66.8, 24.8]
// ];

// --- DEMO PRODUCT DATA (Updated from your image menu with specific images) ---
const demoProducts = [
    // --- BURGERS ---
    // Assuming these will still use a generic burger image if no specific one was provided
    { id: 'b_zinger_classic', name: 'Zinger Burger Classic', description: 'Our signature crispy chicken fillet burger with classic sauce.', price: 350, image_url: 'assets/images/burger.jpeg' },
    { id: 'b_zinger', name: 'Zinger Burger', description: 'Crispy chicken fillet with fresh lettuce and mayo.', price: 270, image_url: 'assets/images/burger.jpeg' },
    { id: 'b_beef', name: 'Beef Burger', description: 'Juicy grilled beef patty, fresh veggies, and our special sauce.', price: 250, image_url: 'assets/images/burger.jpeg' },
    { id: 'b_chicken', name: 'Chicken Burger', description: 'Delicious chicken patty, lettuce, and creamy dressing.', price: 250, image_url: 'assets/images/burger.jpeg' },
    { id: 'b_broast_leg', name: 'Broast Leg', description: 'Crispy and juicy broasted chicken leg piece.', price: 350, image_url: 'assets/images/broast_family_pack_includes_1_broast_leg.jpeg' },
    { id: 'b_broast_chest', name: 'Broast Chest', description: 'Large broasted chicken breast piece, perfectly spiced.', price: 450, image_url: 'assets/images/broast_family_pack_includes_1_broast_leg.jpeg' },

    // --- FRIES ---
    // Assuming these will still use a generic fries/snack image if no specific one was provided
    { id: 'f_masala', name: 'Masala Fries', description: 'Crispy fries tossed in our special tangy masala spice.', price: 150, image_url: 'assets/images/deal1.jpeg' },
    { id: 'f_mayo', name: 'Mayo Fries', description: 'Golden fries topped with creamy mayonnaise.', price: 170, image_url: 'assets/images/deal1.jpeg' },
    { id: 'f_cheez', name: 'Cheez Fries', description: 'Irresistible fries loaded with melted cheese.', price: 250, image_url: 'assets/images/deal1.jpeg' },
    { id: 'f_pizza_small', name: 'Pizza Fries Small', description: 'Fries topped with pizza sauce, cheese, and toppings (small).', price: 350, image_url: 'assets/images/snack.jpeg' },
    { id: 'f_pizza_large', name: 'Pizza Fries Large', description: 'Fries topped with pizza sauce, cheese, and toppings (large).', price: 500, image_url: 'assets/images/snack.jpeg' },
    { id: 'f_mr_special_zinger', name: 'MR Special Zinger Fries', description: 'Our unique fries blend with Zinger flavor.', price: 300, image_url: 'assets/images/deal1.jpeg' },

    // --- SANDWICH + ROLLS ---
    { id: 's_club', name: 'Club Sandwich', description: 'Classic triple-layered sandwich with chicken, egg, and veggies.', price: 250, image_url: 'assets/images/sandwich1.jpeg' },
    { id: 's_bbq', name: 'BBQ Sandwich', description: 'Smoky BBQ chicken with crisp lettuce in toasted bread.', price: 270, image_url: 'assets/images/sandwich2.jpeg' },
    { id: 'r_zinger', name: 'Zinger Roll', description: 'Crispy zinger strip wrapped in a soft paratha with sauce.', price: 170, image_url: 'assets/images/roll.jpeg' }, // Reusing general roll image
    { id: 'r_chicken', name: 'Chicken Roll', description: 'Tender chicken pieces wrapped in a fresh paratha.', price: 150, image_url: 'assets/images/roll.jpeg' }, // Reusing general roll image
    { id: 'r_spring_6pc', name: 'Spring Roll 6 Piece', description: 'Crispy vegetable spring rolls, perfect for a snack.', price: 350, image_url: 'assets/images/snack.jpeg' }, // Reusing general snack image
    { id: 's_chicken_popcorn', name: 'Chicken Pop Corn', description: 'Bite-sized crispy chicken pieces, great for sharing.', price: 300, image_url: 'assets/images/chickenPopCorn.jpeg' },
    { id: 'r_beef_boti', name: 'Beef Boti Roll', description: 'Succulent beef boti pieces wrapped in a fresh paratha with chutney.', price: 180, image_url: 'assets/images/roll.jpeg' }, // Reusing general roll image

    // --- CHINESE + KARAHI ---
    { id: 'c_chowmin', name: 'Chicken Chowmin', description: 'Stir-fried noodles with chicken and mixed vegetables.', price: 400, image_url: 'assets/images/chowmien.jpeg' },
    { id: 'k_chicken_half', name: 'Chicken Karahi Half', description: 'Rich, spicy chicken karahi cooked in traditional Pakistani style (half portion).', price: 800, image_url: 'assets/images/karahiHalf.jpeg' },
    { id: 'k_chicken_full', name: 'Chicken Karahi Full', description: 'Full portion of our aromatic and flavorful chicken karahi.', price: 1500, image_url: 'assets/images/karahi1.jpeg' } // Using karahi1 for full
];

// --- DEMO DEAL DATA for Hero Slider (Updated with specific images) ---
const demoDeals = [
    {
        id: 'deal_burger_fries',
        title: 'Zinger Duo Meal',
        description: 'Get 2 Zinger Burgers, 1 Large Masala Fries, and 2 Soft Drinks.',
        serving: '2 people',
        price: 800,
        image_url: 'assets/images/deal1.jpeg' // Retaining previous image for this generic deal
    },
    {
        id: 'deal_broast_combo',
        title: 'Broast Family Pack',
        description: 'Includes 1 Broast Leg, 1 Broast Chest, and 2 Mayo Fries.',
        serving: '2-3 people',
        price: 1100,
        image_url: 'assets/images/broast_family_pack_includes_1_broast_leg.jpeg'
    },
    {
        id: 'deal_roll_snack',
        title: 'Roll & Popcorn Combo',
        description: '1 Zinger Roll, 1 Beef Boti Roll, and Chicken Pop Corn.',
        serving: '2 people',
        price: 600,
        image_url: 'assets/images/rollPopCornDeal2.jpeg'
    }
];
