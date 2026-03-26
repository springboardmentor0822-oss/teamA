import axios from "axios";
import { useState } from "react";
import "./civic.css";

function Login({ onLogin }) {

const [activeForm, setActiveForm] = useState("login");
const [keepSignedIn, setKeepSignedIn] = useState(true);

const [otp, setOtp] = useState("");
const [emailForOtp, setEmailForOtp] = useState("");
const [newPassword, setNewPassword] = useState("");

// ================= LOGIN =================

const handleLogin = async (e) => {

e.preventDefault();

const data = {
email: e.target.email.value,
password: e.target.password.value
};

try {

const res = await axios.post(
"http://localhost:5000/api/auth/login",
data
);

localStorage.setItem("token", res.data.token);

alert("Login Successful");

if (onLogin) {
onLogin(res.data);
}

} catch (error) {

alert(error.response?.data?.message || "Login failed");

}

};

// ================= REGISTER =================

const handleRegister = async (e) => {

e.preventDefault();

const data = {
name: e.target[0].value,
email: e.target[1].value,
password: e.target[2].value,
location: e.target[3].value,
role: e.target[4].value
};

try {

const res = await axios.post(
"http://localhost:5000/api/auth/register",
data
);

alert(res.data.message);

setEmailForOtp(data.email);

setActiveForm("otp");

} catch (error) {

alert(error.response?.data?.message || "Register failed");

}

};

// ================= VERIFY EMAIL OTP =================

const handleVerifyOtp = async (e) => {

e.preventDefault();

try {

const res = await axios.post(
"http://localhost:5000/api/auth/verify-email",
{
email: emailForOtp,
otp: otp
}
);

alert(res.data.message || "Email verified successfully");

setActiveForm("login");

} catch (error) {

alert(error.response?.data?.message || "OTP verification failed");

}

};

// ================= FORGOT PASSWORD =================

const handleSendOtp = async (e) => {

e.preventDefault();

const email = e.target.email.value;

try{

await axios.post(
"http://localhost:5000/api/auth/forgot-password",
{ email }
);

setEmailForOtp(email);

alert("OTP sent to your email");

setActiveForm("reset");

}catch(error){

alert(error.response?.data?.message || "Error sending OTP");

}

};

// ================= RESET PASSWORD =================

const handleResetPassword = async (e) => {

e.preventDefault();

try{

await axios.post(
"http://localhost:5000/api/auth/reset-password",
{
email: emailForOtp,
otp: otp,
newPassword: newPassword
}
);

alert("Password updated successfully");

setActiveForm("login");

}catch(error){

alert(error.response?.data?.message || "Reset failed");

}

};

return (

<div className="login-container">

<div className="login-left">

<div className="login-header">

<div className="login-logo">

<svg viewBox="0 0 24 24" fill="none">

<path d="M4 11.5L12 4l8 7.5" stroke="white" strokeWidth="2"/>

<path d="M7 10.5v8h10v-8" stroke="white" strokeWidth="2"/>

</svg>

</div>

<h1>Civix</h1>

<p className="subtitle-left">
Digital Civic Engagement Platform
</p>

</div>

<div className="login-features">

<div className="feature-item">

<div className="feature-icon">

<svg viewBox="0 0 24 24" fill="none">

<path d="M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7" stroke="white" strokeWidth="2"/>

<path d="M5 8h8M5 12h8M5 16h6" stroke="white" strokeWidth="2"/>

</svg>

</div>

<div>
<h3>Create & Sign Petitions</h3>
<p>Easily create petitions for issues you care about.</p>
</div>

</div>

</div>

</div>

<div className="login-right">

<div className="login-card">

<h2 className="login-title">Welcome to Civix</h2>

<p className="login-subtitle">
Join our platform to make your voice heard.
</p>

{(activeForm === "login" || activeForm === "register") && (

<div className="login-tabs">

<button
className={activeForm === "login" ? "login-tab active" : "login-tab"}
onClick={() => setActiveForm("login")}

>

Login </button>

<button
className={activeForm === "register" ? "login-tab active" : "login-tab"}
onClick={() => setActiveForm("register")}

>

Register </button>

</div>

)}

{/* LOGIN */}

{activeForm === "login" && (

<form className="login-form" onSubmit={handleLogin}>

<div className="login-field">
<label>Email</label>
<input type="email" name="email" required />
</div>

<div className="login-field">
<label>Password</label>
<input type="password" name="password" required />
</div>

<button type="submit" className="login-btn">
Sign In
</button>

<p className="login-link">
<a onClick={() => setActiveForm("forgot")}>
Forgot Password?
</a>
</p>

<p className="login-link">
<a onClick={() => setActiveForm("register")}>
Register now
</a>
</p>

</form>

)}

{/* REGISTER */}

{activeForm === "register" && (

<form className="login-form" onSubmit={handleRegister}>

<div className="login-field">
<label>Full Name</label>
<input type="text" required />
</div>

<div className="login-field">
<label>Email</label>
<input type="email" required />
</div>

<div className="login-field">
<label>Password</label>
<input type="password" required />
</div>

<div className="login-field">
<label>Location</label>
<input type="text" required />
</div>

<div className="login-field">

<label>I am registering as:</label>

<select required>

<option value="">-- Select --</option>
<option value="citizen">Citizen</option>
<option value="official">Public Official</option>

</select>

</div>

<button type="submit" className="login-btn">
Create Account
</button>

</form>

)}

{/* VERIFY OTP */}

{activeForm === "otp" && (

<form className="login-form" onSubmit={handleVerifyOtp}>

<div className="login-field">

<label>Enter OTP</label>

<input
type="text"
value={otp}
onChange={(e) => setOtp(e.target.value)}
required
/>

</div>

<button type="submit" className="login-btn">
Verify OTP
</button>

</form>

)}

{/* FORGOT PASSWORD */}

{activeForm === "forgot" && (

<form className="login-form" onSubmit={handleSendOtp}>

<div className="login-field">
<label>Email</label>
<input type="email" name="email" required />
</div>

<button type="submit" className="login-btn">
Send OTP
</button>

</form>

)}

{/* RESET PASSWORD */}

{activeForm === "reset" && (

<form className="login-form" onSubmit={handleResetPassword}>

<div className="login-field">
<label>OTP</label>
<input
type="text"
value={otp}
onChange={(e) => setOtp(e.target.value)}
required
/>
</div>

<div className="login-field">
<label>New Password</label>
<input
type="password"
value={newPassword}
onChange={(e) => setNewPassword(e.target.value)}
required
/>
</div>

<button type="submit" className="login-btn">
Reset Password
</button>

</form>

)}

</div>

</div>

</div>

);

}

export default Login;
