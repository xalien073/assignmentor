// app/page.js
"use client";
import { useEffect, useState } from "react";
import Tasks from "./components/Tasks";
import Navbar from "./components/Navbar";
import { users } from "./users";
import Login from "./components/Login";
import { SiMicrosoftazure } from "react-icons/si";

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
      {showLogin && <Login onLogin={handleLogin} />}

      <h2>
        <SiMicrosoftazure style={{ fontSize: "24px" }} />zure Assignments & Topics:
      </h2>
      <Tasks currentUser={currentUser} />
      <hr></hr>
      <h2>
        Leaderboard:
      </h2>
      </main>
    </>
  );
}


// app/page.js
// "use client";
// import { useEffect, useState } from "react";
// import Tasks from './components/Tasks';
// import { users } from "./users";

// function Login({ onLogin }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     const user = users.find(u => u.email === email && u.password === password);
//     if (user) {
//       localStorage.setItem("currentUser", JSON.stringify(user));
//       onLogin(user); // Call the onLogin function to update the app state
//     } else {
//       alert("Invalid email or password.");
//     }
//   };

//   return (
//     <div>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleLogin}>Log In</button>
//     </div>
//   );
// }

// export default function Home() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [showLogin, setShowLogin] = useState(false);

//   useEffect(() => {
//     const savedUser = localStorage.getItem("currentUser");
//     if (savedUser) {
//       setCurrentUser(JSON.parse(savedUser));
//     }
//   }, []);

//   const handleLogin = (user) => {
//     setCurrentUser(user);
//     setShowLogin(false); // Hide login form on successful login
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("currentUser");
//     setCurrentUser(null);
//   };

//   const toggleLogin = () => setShowLogin(!showLogin);

//   return (
//     <div>
//       <h1>AssignMentor</h1>

//       {/* Conditional rendering of login or user email */}
//       {currentUser ? (
//         <div>
//           <p>Welcome, {currentUser.email}</p>
//           <button onClick={handleLogout}>Log Out</button>
//         </div>
//       ) : (
//         <div>
//           <button onClick={toggleLogin}>
//             {showLogin ? "Cancel" : "Log In"}
//           </button>
//           {showLogin && <Login onLogin={handleLogin} />}
//         </div>
//       )}
//       <Tasks currentUser={currentUser} />
        
//     </div>
//   );
// }
