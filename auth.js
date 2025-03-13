const express = require("express");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const router = express.Router();
const DATA_FILE = "./data.json";

// Function to read user data
const readData = () => {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
};

// Function to write user data
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// ✅ User Login API
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const data = readData();
  const user = data.users.find((u) => u.username === username);

  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 300000; // OTP valid for 5 mins

  // Save OTP
  data.otps.push({ userId: user.id, code: otp, expiry });
  writeData(data);

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) return res.status(500).json({ message: "Error sending email" });
    res.json({ message: "OTP sent to email" });
  });
});

// ✅ OTP Verification API
router.post("/verify-otp", (req, res) => {
  const { username, otp } = req.body;
  const data = readData();
  const user = data.users.find((u) => u.username === username);

  if (!user) return res.status(400).json({ message: "User not found" });

  const otpEntry = data.otps.find((o) => o.userId === user.id);
  if (!otpEntry || otpEntry.code !== otp || Date.now() > otpEntry.expiry) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Remove used OTP
  data.otps = data.otps.filter((o) => o.userId !== user.id);
  writeData(data);

  res.json({ message: "OTP verified", success: true });
});

module.exports = router;
