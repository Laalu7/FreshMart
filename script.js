document.addEventListener('DOMContentLoaded', function () {
    // --- Element Selectors ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.getElementById('header');
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmail = document.getElementById('newsletter-email');
    const newsletterMessage = document.getElementById('newsletter-message');
    const footerNewsletterForm = document.getElementById('footer-newsletter-form');
    const footerNewsletterEmail = document.getElementById('footer-newsletter-email');
    const footerNewsletterMessage = document.getElementById('footer-newsletter-message');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    // Cart display elements (Header)
    const cartCountElements = [document.getElementById('cart-count'), document.getElementById('mobile-cart-count')];
    const cartTotalPriceElements = [document.getElementById('cart-total-price'), document.getElementById('mobile-cart-total-price')];
    // Cart Popup Elements
    const cartPopup = document.getElementById('cart-popup');
    const cartPopupOverlay = document.getElementById('cart-popup-overlay');
    const closeCartPopupButton = document.getElementById('close-cart-popup');
    const desktopCartButton = document.getElementById('desktop-cart-button');
    const mobileCartButton = document.getElementById('mobile-cart-button');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartTaxElement = document.getElementById('cart-tax');
    const cartFinalTotalElement = document.getElementById('cart-final-total');
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    const emptyCartMessage = cartItemsList.querySelector('.empty-cart-message');

    // --- State Variables ---
    let cartItems = []; // Array to hold cart item objects: { id, name, price, quantity, image }
    const TAX_RATE = 0.05; // 5% tax rate for simulation

    // --- Helper Functions ---
    function formatPrice(price) {
        return `$${price.toFixed(2)}`;
    }

    // --- Cart Logic Functions ---

    // Update cart display in the header
    function updateHeaderCartDisplay() {
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cartCountElements.forEach(el => {
            if (el) {
                el.textContent = totalCount;
                // Only pulse if count increased (optional)
                // el.classList.add('cart-pulse');
                // setTimeout(() => { el.classList.remove('cart-pulse'); }, 500);
            }
        });
        cartTotalPriceElements.forEach(el => {
            if (el) el.textContent = formatPrice(totalPrice);
        });
    }

    // Render the items inside the cart popup
    function renderCartPopup() {
        cartItemsList.innerHTML = ''; // Clear current items

        if (cartItems.length === 0) {
            cartItemsList.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        } else {
            cartItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                // Use item.id in data attributes for easier targeting
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price">${formatPrice(item.price)}</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls flex items-center">
                            <button class="quantity-decrease" data-id="${item.id}" aria-label="Decrease quantity">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
                        </div>
                        <button class="remove-item-btn" data-id="${item.id}" aria-label="Remove item">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                cartItemsList.appendChild(itemElement);
            });
        }
        updateCartSummary();
    }

    // Calculate and display summary (subtotal, tax, total) in the popup
    function updateCartSummary() {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * TAX_RATE;
        const finalTotal = subtotal + tax;

        cartSubtotalElement.textContent = formatPrice(subtotal);
        cartTaxElement.textContent = formatPrice(tax);
        cartFinalTotalElement.textContent = formatPrice(finalTotal);
    }

    // Add or update item in the cart array
    function addItemToCart(item) {
        const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
        if (existingItemIndex > -1) {
            // Item exists, increase quantity
            cartItems[existingItemIndex].quantity += 1;
        } else {
            // New item, add to cart with quantity 1
            cartItems.push({ ...item, quantity: 1 });
        }
        updateCartState();
    }

     // Update item quantity in the cart array
    function updateItemQuantity(itemId, change) { // change is +1 or -1
         const itemIndex = cartItems.findIndex(cartItem => cartItem.id === itemId);
         if (itemIndex > -1) {
             cartItems[itemIndex].quantity += change;
             if (cartItems[itemIndex].quantity <= 0) {
                 // Remove item if quantity is 0 or less
                 cartItems.splice(itemIndex, 1);
             }
             updateCartState();
         }
    }

     // Remove item completely from the cart array
    function removeItemFromCart(itemId) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        updateCartState();
    }

    // Central function to update all displays after cart changes
    function updateCartState() {
         updateHeaderCartDisplay();
         renderCartPopup(); // Re-render the popup content
         // Optional: Persist cart to localStorage
         // localStorage.setItem('freshmartCart', JSON.stringify(cartItems));
    }

    // --- Popup Visibility Functions ---
    function openCartPopup() {
        renderCartPopup(); // Ensure content is up-to-date before showing
        cartPopup.classList.add('active');
        cartPopupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeCartPopup() {
        cartPopup.classList.remove('active');
        cartPopupOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
    }

    // --- Event Listeners Setup ---

    // Mobile Menu Toggle
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenuButton.innerHTML = mobileMenu.classList.contains('hidden')
                ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`;
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>`;
            });
        });
    }

    // Sticky Header
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('sticky', window.scrollY > 50);
        });
    }

    // Swiper Carousels (Initialize if elements exist)
    if (document.querySelector('.product-swiper')) {
         new Swiper('.product-swiper', {
            slidesPerView: 1.2, spaceBetween: 10, // Adjusted space
            loop: true,
            breakpoints: { 640: { slidesPerView: 2.5, spaceBetween: 15 }, 768: { slidesPerView: 3.5, spaceBetween: 20 }, 1024: { slidesPerView: 4.5, spaceBetween: 20 } },
            pagination: { el: '.product-pagination', clickable: true },
            navigation: { nextEl: '.product-next', prevEl: '.product-prev' },
            autoplay: { delay: 5000, disableOnInteraction: false },
        });
    }
    if (document.querySelector('.testimonial-swiper')) {
         new Swiper('.testimonial-swiper', {
            slidesPerView: 1, spaceBetween: 30, loop: true, centeredSlides: true,
            breakpoints: { 768: { slidesPerView: 1.5 }, 1024: { slidesPerView: 2.5 } },
            pagination: { el: '.testimonial-pagination', clickable: true },
            autoplay: { delay: 6000, disableOnInteraction: true },
        });
    }

    // Newsletter Form Handling
    function handleNewsletterSubmit(form, emailInput, messageElement) {
        if (!form || !emailInput || !messageElement) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                messageElement.textContent = 'Thank you for subscribing!';
                messageElement.className = 'mt-4 text-sm text-green-600';
                emailInput.value = ''; console.log('Newsletter subscription:', email);
            } else {
                messageElement.textContent = 'Please enter a valid email address.';
                messageElement.className = 'mt-4 text-sm text-red-600';
            }
            setTimeout(() => { messageElement.textContent = ''; }, 5000);
        });
    }
    handleNewsletterSubmit(newsletterForm, newsletterEmail, newsletterMessage);
    handleNewsletterSubmit(footerNewsletterForm, footerNewsletterEmail, footerNewsletterMessage);

    // --- Cart Interaction Event Listeners ---

    // Add to Cart Button Clicks
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.product-card');
            if (!card) return;

            const item = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseFloat(card.dataset.price),
                image: card.dataset.image
            };

            if (item.id && item.name && item.price > 0 && item.image) {
                addItemToCart(item);
                // Optional: Briefly show popup after adding
                // openCartPopup();
                // setTimeout(closeCartPopup, 1500); // Close after 1.5 seconds
                 // Pulse the header cart icon
                 cartCountElements.forEach(el => el?.classList.add('cart-pulse'));
                 setTimeout(() => cartCountElements.forEach(el => el?.classList.remove('cart-pulse')), 500);
            } else {
                console.warn("Could not add item - missing data attributes on product card:", card);
            }
        });
    });

    // Open Cart Popup Buttons (Header)
    if (desktopCartButton) desktopCartButton.addEventListener('click', openCartPopup);
    if (mobileCartButton) mobileCartButton.addEventListener('click', openCartPopup);

    // Close Cart Popup Buttons/Overlay
    if (closeCartPopupButton) closeCartPopupButton.addEventListener('click', closeCartPopup);
    if (cartPopupOverlay) cartPopupOverlay.addEventListener('click', closeCartPopup);
    if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeCartPopup);


    // Handle clicks inside the cart popup (Event Delegation)
    cartItemsList.addEventListener('click', (event) => {
         const target = event.target;
         const itemId = target.dataset.id;

         if (!itemId) return; // Exit if click wasn't on a button with data-id

         if (target.classList.contains('quantity-increase')) {
             updateItemQuantity(itemId, 1);
         } else if (target.classList.contains('quantity-decrease')) {
             updateItemQuantity(itemId, -1);
         } else if (target.closest('.remove-item-btn')) { // Check closest ancestor for icon clicks
             removeItemFromCart(target.closest('.remove-item-btn').dataset.id);
         }
    });

    // --- Initial Load ---
    // Optional: Load cart from localStorage on page load
    // const savedCart = localStorage.getItem('freshmartCart');
    // if (savedCart) {
    //    cartItems = JSON.parse(savedCart);
    //    updateCartState(); // Update display based on loaded cart
    // } else {
         updateHeaderCartDisplay(); // Initialize header display even if cart is empty
    // }


}); // End DOMContentLoaded