import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerifyOTP = async () => {
    const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });

    const data = await response.json();
    if (data.success) navigate("/dashboard");
  };

  return (
    <div>
      <h2>Enter OTP</h2>
      <input type="text" placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
      <button onClick={handleVerifyOTP}>Verify OTP</button>
    </div>
  );
};

export default OTPVerification;
