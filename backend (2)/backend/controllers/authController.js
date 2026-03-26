const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { 
  getVerificationEmailTemplate,
  getWelcomeEmailTemplate 
} = require("../utils/emailTemplate");

// ================= GENERATE JWT =================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};



// ================= REGISTER USER =================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    if (!name || !email || !password || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      location,
      verificationToken: hashedOTP,
      verificationTokenExpiresAt: Date.now() + 5 * 60 * 1000, // 5 min
      otpAttempts: 0,
    });

    // Send OTP Email
  const html = getVerificationEmailTemplate(otp);
   await sendEmail({
  to: email,
  subject: "Verify Your Email - Civix",
  html: html,
});

    res.status(201).json({
      message: "OTP sent to your email. Please verify before login.",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= VERIFY EMAIL =================
exports.verifyEmail = async (req, res) => {
  console.log("VERIFY HIT");
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.verificationTokenExpiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        message: "Too many attempts. Please register again.",
      });
    }

    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (hashedOTP !== user.verificationToken) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Success
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    user.otpAttempts = 0;

    await user.save();
    const welcomeHtml = getWelcomeEmailTemplate(user.name);

   await sendEmail({
  to: user.email,
  subject: "Welcome to Civix ",
  html: welcomeHtml,
  });

    res.status(200).json({
      message: "Email verified successfully. You can now login.",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.resetPasswordToken = hashedOTP;
    user.resetPasswordExpiresAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    const html = `<h2>Your OTP for password reset: ${otp}</h2>`;

    await sendEmail({
      to: user.email,
      subject: "Reset Password OTP",
      html
    });

    res.json({
      message: "OTP sent to your email"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }

};
exports.resetPassword = async (req, res) => {

  try {

    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (hashedOTP !== user.resetPasswordToken)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.resetPasswordExpiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    user.isVerified = true;

    await user.save();

    res.json({
      message: "Password reset successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }

};



// ================= LOGIN USER =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      token: generateToken(user._id),
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name, email, location } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (location) user.location = location;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};