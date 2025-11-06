import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css"; 

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // On success, Firebase automatically stores the user session.
      // The user's role will be fetched in the context/state manager (Step 5).
      navigate("/"); // Redirect to Home
    } catch (err) {
      console.error("Login Error:", err.message);
      setError("Failed to log in. Check your email and password.");
    }
  };

  return (
    <div className="login-container">
      {/* ➡️ ADDED THE login-box WRAPPER */}
      <div className="login-box">
      <h2>Welcome Back</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-submit-btn">Login</button>
        
        {error && <p className="error-message">{error}</p>}
      </form>
      </div>  {/* ⬅️ CLOSING login-box */}
    </div>
  );
}

export default LoginPage;