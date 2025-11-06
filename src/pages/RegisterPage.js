import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // Import auth and db
import { useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css"; 

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State to hold the selected role
  const [role, setRole] = useState("Traveller"); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Store the user's role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        role: role, // The role ('Traveller' or 'Guide')
        createdAt: new Date(),
        // Add more fields here (e.g., name, photoUrl)
      });
      
      alert(`Registration successful! You are signed up as a ${role}.`);
      navigate("/"); // Redirect to Home or Profile page
    } catch (err) {
      console.error("Registration Error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      {/* ➡️ ADDED THE register-box WRAPPER */}
      <div className="register-box">  
      <h2>Join Travor</h2>
      <form onSubmit={handleRegister} className="register-form">
        
        {/* Role Selection */}
        <div className="role-selector">
          <p>Sign up as:</p>
          <div className="role-btn-wrapper">
          <button 
            type="button" 
            onClick={() => setRole("Traveller")}
            className={role === "Traveller" ? "role-btn active" : "role-btn"}
          >
            Traveller
          </button>
          <button 
            type="button" 
            onClick={() => setRole("Guide")}
            className={role === "Guide" ? "role-btn active" : "role-btn"}
          >
            Local Guide
          </button>
          </div>
        </div>

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
        <button type="submit" className="register-submit-btn">Register as {role}</button>
        
        {error && <p className="error-message">{error}</p>}
      </form>
      </div>
    </div>
  );
}

export default RegisterPage;