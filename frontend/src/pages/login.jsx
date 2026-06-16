import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    const data = localStorage.getItem("college-user");
    const user = JSON.parse(data);

    if (!user) {
      alert("No account found. Please register first.");
      return;
    }

    if (rollNo === user.rollNo && password === user.password) {
      alert(`Welcome ${user.name}!`);
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
