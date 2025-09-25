// src/components/QuickLogout.jsx
import { useNavigate } from "react-router-dom";
import { removeAuth } from "../AuthRoutes/auth.js";
import GlareHover from "./glareHover.jsx";
import "./QuickLogout.css";

export default function QuickLogout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("QuickLogout clicked ✅"); // debug
    removeAuth();                     // clear auth storage
    navigate("/", { replace: true }); // go back to root
  };

return (
  <div className="quicklogout-container">
    <div className="quicklogout-box" onClick={handleLogout}>
      Quick Logout
    </div>
  </div>
);
}
