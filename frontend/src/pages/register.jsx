import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../style/Register.css"

function Register() {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  function handleRegister() {
    if (password !== confirmpassword) {
      alert("Password do not match");
    }
    const user = {
      name,
      rollNo,
      email,
      phone,
      password,
    };
    localStorage.setItem("college-user", JSON.stringify(user));
    alert("Registration successful!");

    setName("");
    setEmail("");
    setRollNo("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
  }
  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Create Account</h1>

        <p>Join the College Lost & Found portal.</p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="College Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="College Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmpassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleRegister}>Register</button>

        <p className="login-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
