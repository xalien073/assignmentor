// app/components/Login.js
"use client";
import { useState } from "react";
import { users } from "../users";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const user = users.find(
      (u) => u.email === email.trim() && u.password === password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      onLogin(user); // Notify the parent component about successful login
    } else {
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div style={{ margin: "1em", padding: "1em", border: "1px solid #ccc" }}>
      <h2>Login</h2>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ margin: "0.5em 0", padding: "0.5em", width: "100%" }}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: "0.5em 0", padding: "0.5em", width: "100%" }}
        />
      </div>
      <button
        onClick={handleLogin}
        style={{
          padding: "0.5em 1em",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Log In
      </button>
    </div>
  );
}
