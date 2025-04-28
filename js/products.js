// Products page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Update cart count from localStorage
    updateCartCount();
    
    // Load product data
    loadProducts();
    
    // Handle sorting change
    const sortBy = document.getElementById('sort-by');
    if (sortBy) {
        sortBy.addEventListener('change', function() {
            loadProducts(this.value);
        });
    }
    
    // Handle filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filters input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            loadProducts();
        });
    });
    
    // Back to top functionality
    const backToTopButton = document.querySelector('.footer-panel1');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Function to update cart count in the header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-number');
    if (!cartCount) return;
    
    // Get cart items from localStorage
    let cart = JSON.parse(localStorage.getItem('amazonCart')) || [];
    
    // Update the cart count display
    cartCount.textContent = cart.length;
}

// Function to load products
function loadProducts(sortOption = 'Sort by: Featured') {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    
    // Clear existing products
    productGrid.innerHTML = '';
    
    // In a real application, this would fetch products from a server
    // For this demo, we'll use sample product data
    let products = getSampleProducts();
    
    // Apply sorting
    products = sortProducts(products, sortOption);
    
    // Apply filters
    products = filterProducts(products);
    
    // Generate product cards
    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Function to create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    // Create the rating stars HTML
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= product.rating) {
            starsHtml += '<i class="fa-solid fa-star"></i>';
        } else {
            starsHtml += '<i class="fa-regular fa-star"></i>';
        }
    }
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}" onerror="this.src='img/box1.jpg'">
        </div>
        <div class="product-title">${product.title}</div>
        <div class="product-rating">
            ${starsHtml}
            <span class="rating-count">(${product.ratingCount})</span>
        </div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <div class="product-prime">
            ${product.isPrime ? '<i class="fa-solid fa-check"></i> Prime FREE Delivery' : 'FREE Delivery'}
        </div>
        <div class="product-buttons">
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            <button class="save-for-later" data-id="${product.id}">Save for Later</button>
        </div>
    `;
    
    // Add event listeners for buttons
    const addToCartBtn = card.querySelector('.add-to-cart');
    const saveForLaterBtn = card.querySelector('.save-for-later');
    
    addToCartBtn.addEventListener('click', function() {
        addProductToCart(product);
    });
    
    saveForLaterBtn.addEventListener('click', function() {
        saveProductForLater(product);
    });
    
    return card;
}

// Function to add a product to cart
function addProductToCart(product) {
    let cart = JSON.parse(localStorage.getItem('amazonCart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
        // If the product exists, increment the quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // Otherwise, add it with quantity 1
        product.quantity = 1;
        cart.push(product);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('amazonCart', JSON.stringify(cart));
    
    // Update the cart count in the header
    updateCartCount();
    
    // Show a confirmation message
    alert('Item added to your cart!');
}

// Function to save a product for later
function saveProductForLater(product) {
    let savedItems = JSON.parse(localStorage.getItem('amazonSaved')) || [];
    
    // Check if product already exists in saved items
    const existingProductIndex = savedItems.findIndex(item => item.id === product.id);
    
    if (existingProductIndex === -1) {
        // Only add if it doesn't already exist
        savedItems.push(product);
    }
    
    // Save updated saved items to localStorage
    localStorage.setItem('amazonSaved', JSON.stringify(savedItems));
    
    // Show a confirmation message
    alert('Item saved for later!');
}

// Function to sort products based on the selected option
function sortProducts(products, sortOption) {
    switch(sortOption) {
        case 'Price: Low to High':
            return products.sort((a, b) => a.price - b.price);
        case 'Price: High to Low':
            return products.sort((a, b) => b.price - a.price);
        case 'Customer Review':
            return products.sort((a, b) => b.rating - a.rating);
        case 'Newest Arrivals':
            return products.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        default: // Featured
            return products;
    }
}

// Function to filter products based on selected filters
function filterProducts(products) {
    // Get checked department filters
    const departmentFilters = Array.from(document.querySelectorAll('.filters input[type="checkbox"]:checked')).map(checkbox => checkbox.id);
    
    // If no filters are selected, return all products
    if (departmentFilters.length === 0) {
        return products;
    }
    
    // Filter products by department
    return products.filter(product => {
        return departmentFilters.some(filter => product.categories.includes(filter));
    });
}

// Sample product data for demonstration
function getSampleProducts() {
    return [
        {
            id: 1,
            title: "New Apple MacBook Pro with Apple M1 Chip (13-inch, 8GB RAM, 256GB SSD)",
            price: 1299.99,
            image: "img/box1.jpg",
            rating: 5,
            ratingCount: 1423,
            isPrime: true,
            categories: ["electronics", "computers"],
            dateAdded: "2023-01-15"
        },
        {
            id: 2,
            title: "Apple AirPods Pro Wireless Earbuds with MagSafe Charging Case",
            price: 249.99,
            image: "img/box2.jpg",
            rating: 4,
            ratingCount: 5297,
            isPrime: true,
            categories: ["electronics"],
            dateAdded: "2023-02-20"
        },
        {
            id: 3,
            title: "Samsung Galaxy S21 Ultra 5G Factory Unlocked Android Cell Phone 128GB",
            price: 999.99,
            image: "img/box3.jpg",
            rating: 4,
            ratingCount: 3521,
            isPrime: true,
            categories: ["electronics", "smartphone"],
            dateAdded: "2023-03-05"
        },
        {
            id: 4,
            title: "Sony X80J 65 Inch TV: 4K Ultra HD LED Smart Google TV",
            price: 799.99,
            image: "img/box4.jpg",
            rating: 5,
            ratingCount: 1892,
            isPrime: true,
            categories: ["electronics", "tv"],
            dateAdded: "2023-04-10"
        },
        {
            id: 5,
            title: "Canon EOS R5 Full-Frame Mirrorless Camera",
            price: 3899.99,
            image: "img/box5.jpg",
            rating: 5,
            ratingCount: 876,
            isPrime: true,
            categories: ["electronics", "camera"],
            dateAdded: "2023-05-15"
        },
        {
            id: 6,
            title: "Dell XPS 13 Laptop - 13.4-inch 4K UHD+ Touch Display",
            price: 1499.99,
            image: "img/box6.jpg",
            rating: 4,
            ratingCount: 2345,
            isPrime: true,
            categories: ["electronics", "computers"],
            dateAdded: "2023-06-20"
        },
        {
            id: 7,
            title: "Bose QuietComfort 45 Bluetooth Wireless Noise Cancelling Headphones",
            price: 329.99,
            image: "img/box7.jpg",
            rating: 4,
            ratingCount: 4321,
            isPrime: true,
            categories: ["electronics"],
            dateAdded: "2023-07-25"
        },
        {
            id: 8,
            title: "LG OLED C1 Series 65-Inch Class 4K Smart TV",
            price: 1799.99,
            image: "img/box8.jpg",
            rating: 5,
            ratingCount: 1567,
            isPrime: true,
            categories: ["electronics", "tv"],
            dateAdded: "2023-08-30"
        }
    ];
} 