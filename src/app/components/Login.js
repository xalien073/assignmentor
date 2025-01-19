// app/components/Login.js
"use client";
import { useState } from "react";
import { users } from "../users";
import {
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";

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
    <Box
  style={{
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    margin: "50px auto",
    width: "400px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  }}
>
  <Typography variant="h6" style={{ marginBottom: "20px" }}>
    Login
  </Typography>
  <TextField
    label="Email"
    type="email"
    fullWidth
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    style={{ marginBottom: "10px" }}
  />
  <TextField
    label="Password"
    type="password"
    fullWidth
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{ marginBottom: "10px" }}
  />
  <Button
    variant="contained"
    color="primary"
    onClick={handleLogin}
    fullWidth
  >
    Log In
  </Button>
</Box>
  );
}
