/**
 * Learn and Play Your Strings Portal Interactivity
 */

/**
 * Firebase Config - REPLACE WITH YOUR GOOGLE CLOUD/FIREBASE CREDENTIALS
 */
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Google Firebase (Simulated if config is default)
let googleAuthReady = false;
try {
    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        googleAuthReady = true;
        console.log("Google Firebase Ready.");
    }
} catch (e) {
    console.warn("Firebase initialization skipped.");
}

const selectionView = document.getElementById('selection-view');
const loginView = document.getElementById('login-view');
const loginTitle = document.getElementById('login-title');
const loginSubtitle = document.getElementById('login-subtitle');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const studentToggle = document.getElementById('student-toggle');
const loginFooter = document.getElementById('login-footer');
const btnSignin = document.getElementById('btn-signin');
const btnSignup = document.getElementById('btn-signup');

const usernameLabel = document.getElementById('username-label');
const usernameInput = document.getElementById('username');

let currentRole = null;
let currentOTP = null;
let pendingUserData = null;

/**
 * Transitions to the login view for a specific role
 */
function showLogin(role) {
    currentRole = role;
    
    // Reset views
    signupForm.style.display = 'none';
    document.getElementById('otp-view').style.display = 'none';
    loginForm.style.display = 'block';

    if (role === 'student') {
        studentToggle.style.display = 'flex';
        usernameLabel.textContent = 'WhatsApp Number';
        usernameInput.placeholder = 'e.g. 9876543210';
        toggleStudentForm('signin'); // Default to sign in
        loginFooter.style.display = 'block';
    } else {
        studentToggle.style.display = 'none';
        usernameLabel.textContent = 'Username';
        usernameInput.placeholder = 'e.g. admin_user';
        loginTitle.textContent = 'Admin Portal';
        loginSubtitle.textContent = 'Enter administrative credentials';
        loginFooter.style.display = 'none'; // Hide recovery for Admin
    }

    // Toggle views
    selectionView.classList.remove('active');
    setTimeout(() => {
        selectionView.style.display = 'none';
        loginView.style.display = 'block';
        setTimeout(() => {
            loginView.classList.add('active');
        }, 50);
    }, 400);
}

/**
 * Toggles between Sign In and Sign Up for Students
 */
function toggleStudentForm(type) {
    document.getElementById('otp-view').style.display = 'none';
    document.getElementById('forgot-pass-view').style.display = 'none';
    document.getElementById('new-pass-view').style.display = 'none';
    studentToggle.style.display = 'flex'; // Ensure toggle persists
    
    if (type === 'signin') {
        btnSignin.classList.add('active');
        btnSignup.classList.remove('active');
        loginTitle.textContent = 'Student Sign In';
        loginSubtitle.textContent = 'Welcome back! Please enter your registered number.';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        loginFooter.style.display = 'block';
    } else {
        btnSignup.classList.add('active');
        btnSignin.classList.remove('active');
        loginTitle.textContent = 'Student Enrollment';
        loginSubtitle.textContent = 'Join "Learn and Play Your Strings" and start your journey.';
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        loginFooter.style.display = 'none';
    }
}
/**
 * Transitions back to the selection view
 */
function showSelection() {
    loginView.classList.remove('active');
    setTimeout(() => {
        loginView.style.display = 'none';
        selectionView.style.display = 'block';
        setTimeout(() => {
            selectionView.classList.add('active');
        }, 50);
    }, 400);
}

/**
 * Handles the login form submission
 */
function handleLogin(event) {
    event.preventDefault();
    const identifier = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('submit-btn');

    submitBtn.textContent = 'Authenticating...';
    submitBtn.disabled = true;

    setTimeout(() => {
        if (currentRole === 'admin') {
            // Admin simulation
            const savedAdminUser = localStorage.getItem('admin_username') || 'admin';
            const savedAdminPass = localStorage.getItem('admin_password') || 'admin123';
            if (identifier === savedAdminUser && password === savedAdminPass) {
                window.location.href = 'admin_dashboard.html';
            } else {
                alert('Invalid Admin credentials!');
                resetSubmitBtn(submitBtn);
            }
        } else {
            // Student verification (WhatsApp Number ONLY)
            const students = JSON.parse(localStorage.getItem('registered_students') || '[]');
            const student = students.find(s => s.whatsapp === identifier && s.password === password);

            if (student) {
                sessionStorage.setItem('portal_username', student.name);
                window.location.href = 'student_dashboard.html';
            } else {
                alert('Account not found with this WhatsApp number or incorrect password.');
                resetSubmitBtn(submitBtn);
            }
        }
    }, 1500);
}

/**
 * Handles the student enrollment (Sign Up) - Triggering OTP
 */
function handleSignUp(event) {
    event.preventDefault();
    const signupBtn = document.getElementById('signup-btn');
    const whatsapp = document.getElementById('reg-whatsapp').value.trim();
    
    // Check if WhatsApp Number already exists
    const students = JSON.parse(localStorage.getItem('registered_students') || '[]');
    if (students.some(s => s.whatsapp === whatsapp)) {
        alert('This WhatsApp number is already registered. Please Sign In.');
        return;
    }

    // Capture pending data
    pendingUserData = {
        name: document.getElementById('reg-name').value.trim(),
        dob: document.getElementById('reg-dob').value,
        email: document.getElementById('reg-email').value.trim(),
        gender: document.getElementById('reg-gender').value,
        country: document.getElementById('reg-country').value.trim(),
        whatsapp: whatsapp,
        password: document.getElementById('reg-pass').value,
        timestamp: new Date().toISOString()
    };

    // Save Student Data immediately
    students.push(pendingUserData);
    localStorage.setItem('registered_students', JSON.stringify(students));

    console.log('User signed up and saved:', pendingUserData);

    // UI Feedback & Redirection
    signupBtn.textContent = 'Enrolling...';
    signupBtn.disabled = true;

    setTimeout(() => {
        alert(`Welcome ${pendingUserData.name}! Your enrollment is successful.`);
        sessionStorage.setItem('portal_username', pendingUserData.name);
        window.location.href = 'student_dashboard.html';
    }, 1000);
}


/**
 * Handles the OTP verification
 */
let resetMode = false;
let resetWhatsapp = null;

function showForgotPassword() {
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
    document.getElementById('otp-view').style.display = 'none';
    document.getElementById('forgot-pass-view').style.display = 'block';
    loginTitle.textContent = 'Reset Password';
    loginSubtitle.textContent = 'Account Recovery';
    loginFooter.style.display = 'none';
}

function handleResetRequest(event) {
    event.preventDefault();
    const whatsapp = document.getElementById('reset-whatsapp').value.trim();
    const dob = document.getElementById('reset-dob').value;
    const country = document.getElementById('reset-country').value.trim().toLowerCase();
    
    const students = JSON.parse(localStorage.getItem('registered_students') || '[]');
    
    // Multi-factor verification
    const student = students.find(s => 
        s.whatsapp === whatsapp && 
        s.dob === dob && 
        s.country.toLowerCase() === country
    );

    if (student) {
        resetMode = true;
        resetWhatsapp = whatsapp;
        
        // Show Reset Password View directly
        document.getElementById('forgot-pass-view').style.display = 'none';
        document.getElementById('new-pass-view').style.display = 'block';
        console.log('Identity verified for:', whatsapp);
    } else {
        alert('Verification failed. The information provided does not match our records.');
    }
}

function handleOTPVerify(event) {
    event.preventDefault();
    const dots = document.querySelectorAll('.otp-dot');
    const enteredOTP = Array.from(dots).map(d => d.value).join('');

    if (enteredOTP === currentOTP) {
        if (resetMode) {
            document.getElementById('otp-view').style.display = 'none';
            document.getElementById('new-pass-view').style.display = 'block';
        } else {
            finalizeRegistration();
        }
    } else {
        alert('Invalid code. Please try again.');
        dots.forEach(d => d.value = '');
    }
}

function handleFinalReset(event) {
    event.preventDefault();
    const newPass = document.getElementById('final-new-pass').value;
    const students = JSON.parse(localStorage.getItem('registered_students') || '[]');
    
    const index = students.findIndex(s => s.whatsapp === resetWhatsapp);
    if (index !== -1) {
        students[index].password = newPass;
        localStorage.setItem('registered_students', JSON.stringify(students));
        
        alert('Password updated successfully! Please log in.');
        location.reload();
    }
}

function finalizeRegistration() {
    // SAVE USER
    const students = JSON.parse(localStorage.getItem('registered_students') || '[]');
    students.push(pendingUserData);
    localStorage.setItem('registered_students', JSON.stringify(students));
    
    alert('Enrollment successful! Redirecting...');
    sessionStorage.setItem('portal_username', pendingUserData.name);
    window.location.href = 'student_dashboard.html';
}

function resendOTP() {
    alert('A new code has been sent to your WhatsApp number.');
    console.log('New simulated OTP prompted.');
}

// Handle OTP input focus jumping
document.querySelectorAll('.otp-dot').forEach((dot, index, dots) => {
    dot.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < dots.length - 1) {
            dots[index + 1].focus();
        }
    });
    dot.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            dots[index - 1].focus();
        }
    });
});

// Initialize Database if empty (Simulation)
if (!localStorage.getItem('registered_students')) {
    localStorage.setItem('registered_students', JSON.stringify([]));
    console.log('Student database initialized.');
}

function resetSubmitBtn(btn, text = 'Continue') {
    btn.textContent = text;
    btn.disabled = false;
}

// Global scope access
window.showLogin = showLogin;
window.showSelection = showSelection;
window.handleLogin = handleLogin;
window.handleSignUp = handleSignUp;
window.toggleStudentForm = toggleStudentForm;
window.handleOTPVerify = handleOTPVerify;
window.resendOTP = resendOTP;
window.showForgotPassword = showForgotPassword;
window.handleResetRequest = handleResetRequest;
window.handleFinalReset = handleFinalReset;
