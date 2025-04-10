// app/components/Navbar.js
"use client";
import Link from "next/link";
import { useState } from "react";
import { SiMicrosoftazure } from "react-icons/si";

export default function Navbar({ currentUser, onToggle, onLogout }) {
  // const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    // setShowMenu(!showMenu);
    onToggle();
  };

  return (
    <nav
      style={{
        display: "flex", // Flexbox for layout
        alignItems: "center", // Vertically center items
        justifyContent: "space-between", // Space out items
        padding: "1em",
        borderBottom: "1px solid #ccc",
        backgroundColor: "#000000",
        color: "#ffffff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link href="/" style={{ marginRight: "1em", fontSize: "18px" }}>
          <SiMicrosoftazure style={{ fontSize: "24px" }} />
          ssignMentor
        </Link>
        <Link href="/about" style={{ marginRight: "1em", fontSize: "18px" }}>
          About the <SiMicrosoftazure style={{ fontSize: "24px" }} />
          ssignMentor?
        </Link>
        <Link href="/credits" style={{ marginRight: "1em", fontSize: "18px" }}>
          Credits
        </Link>
      </div>

      <div>
        {currentUser ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <strong style={{ color: "#ffffff", marginRight: "1em" }}>
              Welcome, {currentUser.email}
            </strong>
            <button
              onClick={onLogout}
              style={{
                padding: "0.5em 1em",
                backgroundColor: "#FF0000",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Log Out
            </button>
          </div>
        ) : (
          <button
            onClick={toggleMenu}
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
        )}
      </div>
    </nav>
  );
}



// "use client";
// import Link from "next/link";
// import { useState } from "react";
// import { SiMicrosoftazure } from "react-icons/si";

// export default function Navbar({ currentUser, onToggle, onLogout }) {
//   const [showMenu, setShowMenu] = useState(false);

//   const toggleMenu = () => {
//     setShowMenu(!showMenu);
//     onToggle();
//   };

//   return (
//     <nav style={{
//       padding: "1em", borderBottom: "1px solid #ccc",
//       backgroundColor: "#000000", color: "#ffffff"
//       }}>
//       <Link href="/" style={{ marginRight: "1em", fontSize: "18px" }}>
//       <SiMicrosoftazure style={{ fontSize: "24px" }} />ssignMentor
//       </Link>
//       <Link href="/about    " style={{ marginRight: "1em", fontSize: "18px" }}>
//         About the <SiMicrosoftazure style={{ fontSize: "24px" }} />ssignMentor?
//       </Link>
//       <Link href="/credits" style={{ marginRight: "1em", fontSize: "18px" }}>
//         Credits
//       </Link>
//       {currentUser ? (
//         <div style={{ display: "inline", marginLeft: "1em" }}>
//           <strong style={{
//             color: "#ffffff"
//           }}
          
//           >Welcome, {currentUser.email}</strong>
//           <button onClick={onLogout}
//           style={{
//             marginLeft: "auto",
//             padding: "0.5em 1em",
//             backgroundColor: "#FF0000",
//             color: "#fff",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//           }}
//           >
//             Log Out
//           </button>
//         </div>
//       ) : (
//         <button onClick={toggleMenu}
//         style={{
//           padding: "0.5em 1em",
//           backgroundColor: "#0070f3",
//           color: "#fff",
//           border: "none",
//           borderRadius: "4px",
//           cursor: "pointer",
//         }}
//         >
//           {showMenu ? "Cancel" : "Log In"}
//         </button>
//       )}
//     </nav>
//   );
// }
