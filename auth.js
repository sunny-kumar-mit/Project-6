// Initialize user database if it doesn't exist
if (!localStorage.getItem('solarFridgeUsers')) {
    localStorage.setItem('solarFridgeUsers', JSON.stringify([
        {
            "username": "admin",
            "email": "admin@example.com",
            "password": "admin123"
        }
    ]));
}

// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

// Initialize forms if they exist
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        handleLogin();
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        handleRegister();
    });
}

// Handle login
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const ipAddress = document.getElementById('ip-address').value;
    
    // Clear previous errors
    loginError.textContent = '';
    
    // Validate IP address format
    if (!isValidIP(ipAddress)) {
        showError(loginError, "Please enter a valid IP address");
        return false;
    }
    
    const users = JSON.parse(localStorage.getItem('solarFridgeUsers'));
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store current user and IP in localStorage
        const currentUser = {
            username: user.username,
            email: user.email,
            ipAddress: ipAddress
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        return true;
    } else {
        showError(loginError, "Invalid username or password");
        return false;
    }
}

// Handle registration
function handleRegister() {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    // Clear previous errors
    registerError.textContent = '';
    
    // Validate inputs
    if (password !== confirmPassword) {
        showError(registerError, "Passwords don't match");
        return false;
    }
    
    const users = JSON.parse(localStorage.getItem('solarFridgeUsers'));
    
    if (users.some(u => u.username === username)) {
        showError(registerError, "Username already exists");
        return false;
    }
    
    if (users.some(u => u.email === email)) {
        showError(registerError, "Email already registered");
        return false;
    }
    
    // Add new user
    users.push({
        username,
        email,
        password
    });
    
    // Save to localStorage
    localStorage.setItem('solarFridgeUsers', JSON.stringify(users));
    
    // Show success and redirect to login
    showError(registerError, "Registration successful! Redirecting...", "success");
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
    return true;
}

// Helper function to show error messages
function showError(element, message, type = "error") {
    element.textContent = message;
    element.style.color = type === "error" ? "var(--danger)" : "var(--success)";
    setTimeout(() => {
        element.textContent = '';
    }, 5000);
}

// Validate IP address
function isValidIP(ip) {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
}

// Check if user is logged in when accessing dashboard
function checkAuth() {
    if (window.location.pathname.includes('dashboard.html')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = 'index.html';
        }
    }
}

// Initialize auth check
window.addEventListener('DOMContentLoaded', checkAuth);