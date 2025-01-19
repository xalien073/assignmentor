// app/page.js
"use client";
import { useEffect, useState } from "react";
// import Tasks from "./components/Tasks";
import Navbar from "./components/Navbar";
import { users } from "./users";
import Login from "./components/Login";
import AzureGrids from "./components/AzureTables";
import { Modal } from "@mui/material";

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

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <>
      <Navbar currentUser={currentUser}
      onToggle={() => setShowLogin(!showLogin)} onLogout={handleLogout} />
      <main style={{
        padding: "0.7em 1.3em"
      }}
      >
      {/* Conditional rendering of login form */}
      <Modal open={showLogin} onClose={() => setShowLogin(false)}>
        <Login onLogin={handleLogin} />
      </Modal>

      <AzureGrids currentUser={currentUser} />
      
      {/* <Tasks currentUser={currentUser} /> */}
      <hr></hr>
      </main>
    </>
  );
}


