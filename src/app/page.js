// app/page.js
"use client";
import { useEffect, useState } from "react";
import Tasks from './components/Tasks';
import { users } from "./users"; // Make sure this path is correct

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      onLogin(user); // Call the onLogin function to update the app state
    } else {
      alert("Invalid email or password.");
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setShowLogin(false); // Hide login form on successful login
  };

  const toggleLogin = () => setShowLogin(!showLogin);

  return (
    <div>
      <h1>AssignMentor</h1>

      {/* Conditional rendering of login or user email */}
      {currentUser ? (
        <div>
          <p>Welcome, {currentUser.email}</p>
        </div>
      ) : (
        <div>
          <button onClick={toggleLogin}>
            {showLogin ? "Cancel" : "Log In"}
          </button>
          {showLogin && <Login onLogin={handleLogin} />}
        </div>
      )}
      <Tasks currentUser={currentUser} />
    </div>
  );
}

