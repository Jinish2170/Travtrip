// Function to handle sign-in
document.getElementById('signin-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Retrieve input values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validate inputs
    if (!email) {
        alert('Please enter your email.');
        return;
    } else if (!isEmailValid(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (!password) {
        alert('Please enter your password.');
        return;
    }

    // Display loader (make sure you have an element with id "loader" in your HTML)
    document.getElementById('loader').style.display = 'block';

    // Use new backend API
    const targetUrl = 'http://localhost:5000/api/auth/signin';

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });

        const data = await response.json();

        document.getElementById('loader').style.display = 'none';

        if (response.ok) {
            // Show success message and redirect
            showSuccessMessage();
            alert(data.message || `Login successful for ${email}!`);
            setTimeout(() => {
                window.location.href = '../index1/index.html'; // Redirect URL
            }, 100);
        } else {
            // Display error message (e.g., "Email not found" or "Password is incorrect")
            alert(data.message || 'Login failed: Invalid email or password.');
        }
    } catch (error) {
        document.getElementById('loader').style.display = 'none';
        console.error('Error during request:', error);

        if (error.message.includes('Failed to fetch')) {
            alert('There was a network error. Please check your connection and try again.');
        } else {
            alert('There was an error processing your request.');
        }   
    } finally {
        // Ensure the loader is hidden in case of any error
        document.getElementById('loader').style.display = 'none';
    }
});

// Function to validate email format
function isEmailValid(email) {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

// Function to display a success message
function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.classList.add('success-message');
    successMessage.innerHTML = '<i class="fa fa-check-circle"></i> Sign-in successful!';
    document.querySelector('main.auth-container').appendChild(successMessage);
    successMessage.style.display = 'block';

    // Remove the success message after 3 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
        successMessage.remove();
    }, 1000);
}

// Real-time validation for input fields
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

function validateInput(inputElement, isValid) {
    if (isValid) {
        inputElement.classList.remove('invalid');
    } else {
        inputElement.classList.add('invalid');
    }
}

emailInput.addEventListener('input', () => {
    validateInput(emailInput, isEmailValid(emailInput.value.trim()));
});

passwordInput.addEventListener('input', () => {
    // Here we simply check that the password field is not empty.
    validateInput(passwordInput, passwordInput.value.trim().length > 0);
});

// Show/Hide password functionality
document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('.password-container input');
    const passwordStateText = document.createElement('span');
    passwordStateText.classList.add('password-state-text');
    passwordStateText.textContent = 'Show Password';
    togglePassword.parentNode.insertBefore(passwordStateText, togglePassword.nextSibling);

    togglePassword.addEventListener('click', function() {
        // Toggle the type attribute
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Toggle the icon and text
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
        passwordStateText.textContent = type === 'password' ? 'Show Password' : 'Hide Password';
    });
});