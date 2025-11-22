document.addEventListener("DOMContentLoaded", function() {
    //cart coutner
    updateCartCount();

    //mobile menu toggle
    initializeMobileMenu();

    if (window.location.pathname.includes("cart.html")) {
        displayCart();
    }

    if (window.location.pathname.includes("checkout.html")) {
        displayCheckoutSummary();
    }

    //form validation for login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    //form validation for register
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegistation);
    }

    //form validation for checkout
    const checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", handleCheckout);
    }
});

function initializeMobileMenu() {
    const menuToggle = document.getElementById("menutoggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function() {
            navMenu.classList.toggle("show");
        });
    }
}

//Cart functionality

//Dom manipulation for cart count

function addToCart (name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert(name + " has been added to your cart.");
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll("#cartCount");
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function displayCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cartItems");
    const cartSummary = document.getElementById("cartSummary");

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class = "cart-empty">
                <p>Your cart is empty.</p>
                <a href = "index.html#menu-section" class = "btn btn-primary mt-1">Browse Menu</a>
            </div>
        `;
        if (cartSummary) cartSummary.style.display = "none";
        return;
    }

    let cartHTML = '';

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;

        cartHTML += `
            <div class = "cart-item">
                <img src = "${item.image}" alt = "${item.name}">
                <div class = "cart-item-info">
                    <h4>${item.name}</h4>
                    <p class = "cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class = "quantity-control">
                    <button onClick = "updateQuantity(${index}, -1)" aria-label="Decrease quantity">-</button>
                    <span>${item.quantity}</span>
                    <button onClick = "updateQuantity(${index}, 1)" aria-label="Increase quantity">+</button>
                </div>
                <span class = "cart-item-subtotal">$${subtotal.toFixed(2)}</span>
                <span class = "cart-item-remove" onClick = "removeFormCart(${index})" aria-label="Remove item">&#10005;</span>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = cartHTML;

    if (cartSummary) {
        cartSummary.style.display = "block";
        updateCartSummary();
    }
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal * 0.10;
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * 0.15;
    const total = taxableAmount + tax;

    const subtotalEl = document.getElementById("cartSubtotal");
    const discountEl = document.getElementById("cartDiscount");
    const taxEl = document.getElementById("cartTax");
    const totalEl = document.getElementById("cartTotal");

    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (discountEl) discountEl.textContent = '-$' + discount.toFixed(2);
    if (taxEl) taxEl.textContent = '$' + tax.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
}

function updateQuantity (index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart[index]) {
        cart [index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice (index,1);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        displayCart();
    }
}

function removeFormCart (index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice (index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

function clearCart() {
    localStorage.removeItem("cart");
    updateCartCount();

    if (window.location.pathname.includes("cart.html")) {
        displayCart();
    }
}

function displayCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderItemsContainer = document.getElementById("orderItems");

    if (!orderItemsContainer) return;

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = `<p>No items in cart. <a href = "index.html#menu-section">Browse Menu</a></p>`;
        return;
    }

    let itemsHTML = '';
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        itemsHTML += `
            <div class = "order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
        `;
    });

    orderItemsContainer.innerHTML = itemsHTML;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal * 0.10;
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * 0.15;
    const total = taxableAmount + tax;

    const checkoutSubtotal = document.getElementById("checkoutSubtotal");
    const checkoutDiscount = document.getElementById("checkoutDiscount");
    const checkoutTax = document.getElementById("checkoutTax");
    const checkoutTotal = document.getElementById("checkoutTotal");
    const amountPaid = document.getElementById("amountPaid");

    if (checkoutSubtotal) checkoutSubtotal.textContent = '$' + subtotal.toFixed(2);
    if (checkoutDiscount) checkoutDiscount.textContent = '-$' + discount.toFixed(2);
    if (checkoutTax) checkoutTax.textContent = '$' + tax.toFixed(2);
    if (checkoutTotal) checkoutTotal.textContent = '$' + total.toFixed(2);
    if (amountPaid) amountPaid.value = '$' + total.toFixed(2);
}

function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const messageContainer = document.getElementById("loginMessage");

    let isValid = true;

    if (!username.value.trim()) {
        showError("usernameError");
        isValid = false;
    } else {
        hideError("usernameError");
    }

    if (!password.value.trim()) {
        showError("passwordError");
        isValid = false;
    } else {
        hideError("passwordError");
    }

    if (isValid) {
        messageContainer.innerHTML = '<div class = "alert alert-success">Login successful! Redirecting...</div>';

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

function handleRegistation(e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName");
    const dob = document.getElementById("dob");
    const email = document.getElementById("email");
    const regUsername = document.getElementById("regUsername");
    const regPassword = document. getElementById("regPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const terms = document.getElementById("terms");
    const messageContainer = document.getElementById("registerMessage");

    let isValid = true;

    if (!fullName.value.trim()) {
        showError("fullNameError");
        isValid = false;
    } else {
        hideError("fullNameError");
    }

    if (!dob.value) {
        showError("dobError");
        isValid = false;
    } else {
        hideError("dobError");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
        showError("emailError");
        isValid = false;
    } else {
        hideError("emailError");
    }

    if (!regUsername.value.trim() || regUsername.value.length < 4) {
        showError ("regUsernameError");
        isValid = false;
    } else {
        hideError("regUsernameError");
    }

    if (!regPassword.value || regPassword.value.length < 6) {
        showError("regPasswordError");
        isValid = false;
    } else {
        hideError("regPasswordError");
    }

    if (confirmPassword.value !== regPassword.value) {
        showError("confirmPasswordError");
        isValid = false;
    } else {
        hideError("confirmPasswordError");
    }

    if (!terms.checked) {
        showError("termsError");
        isValid = false;
    } else {
        hideError("termsError");
    }

    if (isValid) {
        messageContainer.innerHTML = '<div class="alert alert-success">Registration successful! Please login.</div>';

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

function handleCheckout(e) {
    e.preventDefault();

    const shippingName = document.getElementById("shippingName");
    const shippingEmail = document.getElementById("shippingEmail");
    const shippingPhone = document.getElementById("shippingPhone");
    const shippingAddress = document.getElementById("shippingAddress");
    const shippingCity = document.getElementById("shippingCity");
    const paymentMethod = document.getElementById("paymentMethod");
    const messageContainer = document.getElementById("checkoutMessage");

    let isValid = true;

    if (!shippingName.value.trim()) {
        showError("shippingNameError");
        isValid = false;
    } else {
        hideError("shippingNameError");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!shippingEmail.value.trim() || !emailRegex.test(shippingEmail.value)) {
        showError("shippingEmailError");
        isValid = false;
    } else {
        hideError("shippingEmailError");
    }

    if (!shippingPhone.value.trim()) {
        showError("shippingPhoneError");
    } else {
        hideError("shippingPhoneError");
    }

    if (!shippingAddress.value.trim()) {
        showError("shippingAddressError");
        isValid = false;
    } else {
        hideError("shippingAddressError");
    }

    if (!shippingCity.value.trim()) {
        showError("shippingCityError");
        isValid = false;
    } else {
        hideError("shippingCityError");
    }

    if (!paymentMethod.value) {
        alert ("Please select a payment method");
        isValid = false;
    }

    if (isValid) {
        messageContainer.innerHTML = '<div class = "alert alert-success">Order placed successfully! Thank you for your order.</div>';

        localStorage.removeItem("Cart");
        updateCartCount();

        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    }
}

function showError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.add("show");
    }
}

function hideError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.remove("show");
    }
}