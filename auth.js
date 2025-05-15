// Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, redirect to main app
        window.location.href = 'index.html';
    }
});

// Show/Hide forms
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    clearErrors();
}

function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
    clearErrors();
}

function clearErrors() {
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
}

// Login form submission
document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        // Redirect will happen automatically via onAuthStateChanged
    } catch (error) {
        document.getElementById('loginError').textContent = error.message;
    }
});

// Register form submission
document.getElementById('registerFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        document.getElementById('registerError').textContent = 'Passwords do not match';
        return;
    }
    
    try {
        await auth.createUserWithEmailAndPassword(email, password);
        // Redirect will happen automatically via onAuthStateChanged
    } catch (error) {
        document.getElementById('registerError').textContent = error.message;
    }
});