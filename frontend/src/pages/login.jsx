import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");

  const demoUser = {
    rollNo: "2301234",
    password: "keshav123",
  };

  function handleLogin() {
    if (rollNo === demoUser.rollNo && password === demoUser.password) {
      alert("Login Successful!");
    } else {
      alert("Invalid Credentials!");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>College Lost & Found</h1>
        <p>Find. Report. Return.</p>

        <input
          type="text"
          placeholder="College Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
        <p className="signup-text">
          Don't Have an Account? <Link to="/register">SIGN UP</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
