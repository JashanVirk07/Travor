// src/_test_/FullNavigationEmailFlow.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";


//RegisterPage Component
const RegisterPage = ({ onRegister }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState({});

  // Handle form submission with validation
  const handleSubmit = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onRegister({ name, email, password });
    }
  };

  return (
    <div>
      <h1>RegisterPage</h1>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {errors.name && <div>{errors.name}</div>}
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <div>{errors.email}</div>}
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && <div>{errors.password}</div>}
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
};


// EmailVerificationPage Component

const EmailVerificationPage = ({ email, onVerify }) => {
  return (
    <div>
      <h1>EmailVerificationPage</h1>
      <p>Verification email sent to {email}</p>
      <button onClick={onVerify}>Verify Email</button>
    </div>
  );
};


// HomePage Component

const HomePage = ({ onLogout }) => {
  return (
    <div>
      <h1>HomePage</h1>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};


// LoginPage Component

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div>
      <h1>LoginPage</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => onLogin({ email, password })}>Login</button>
    </div>
  );
};


// Full Flow App

const FullFlowMockApp = () => {
  const [page, setPage] = React.useState("register"); // Current page state
  const [userEmail, setUserEmail] = React.useState(""); // Store user email for verification

  // Register handler
  const handleRegister = ({ name, email, password }) => {
    setUserEmail(email);
    setPage("emailVerification");
  };

  // Email verification handler
  const handleVerify = () => setPage("home");

  // Logout handler
  const handleLogout = () => setPage("login");

  // Login handler
  const handleLogin = ({ email, password }) => {
    setPage("home");
  };

  // Render page based on current state
  switch (page) {
    case "register":
      return <RegisterPage onRegister={handleRegister} />;
    case "emailVerification":
      return (
        <EmailVerificationPage email={userEmail} onVerify={handleVerify} />
      );
    case "home":
      return <HomePage onLogout={handleLogout} />;
    case "login":
      return <LoginPage onLogin={handleLogin} />;
    default:
      return null;
  }
};

// --------------------
// Full Navigation Flow Test
// --------------------
describe("Full Navigation Email Flow ", () => {
  test("Register → EmailVerification → HomePage → Logout → Login", async () => {
    render(<FullFlowMockApp />);

    // -----------------------------
    // Step 1: Attempt to submit empty form
    const registerButton = screen.getByRole("button", { name: /register/i });
    fireEvent.click(registerButton);

    // Expect validation errors to show
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    // -----------------------------
    // Step 2: Fill out form and submit
    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "alice@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(registerButton);

    // -----------------------------
    // Step 3: Email verification page
    await screen.findByText(/verification email sent to alice@example.com/i);
    const verifyButton = screen.getByRole("button", { name: /verify email/i });
    fireEvent.click(verifyButton);

    // -----------------------------
    // Step 4: HomePage
    await screen.findByText(/homepage/i);
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    // -----------------------------
    // Step 5: Login page
    await screen.findByText(/loginpage/i);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "alice@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    // -----------------------------
    // Step 6: Back to HomePage
    await screen.findByText(/homepage/i);
  });
});
