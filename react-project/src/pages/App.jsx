import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  login as apiLogin,
  removeAuth,
  signup as apiSignup,
} from "../AuthRoutes/auth.js";

import BlurText from "../components/blurText.jsx";
import TextType from "../components/textType.jsx";
import StarBorder from "../components/starBorder";
import Beams from "../components/beams.jsx";
import GlareHover from "../components/glareHover.jsx";
import TargetCursor from "../components/TargetCursor.jsx";
import HidePassword from "../assets/hideps.png";
import ShowPassword from "../assets/showps.png";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // success message for signup
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = async () => {
    setError("");
    setSuccess("");
    setLoadingLogin(true);
    setLoadingSignup(false);

    try {
      await apiLogin(username, password);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    let usernameErrors = [];
    let passwordErrors = [];

    // ✅ Username checks
    if (username.length < 8) {
      usernameErrors.push("• Must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(username)) {
      usernameErrors.push("• Must contain at least one uppercase letter");
    }
    if (!/[0-9]/.test(username)) {
      usernameErrors.push("• Must contain at least one number");
    }

    // ✅ Password checks
    if (password.length < 8) {
      passwordErrors.push("• Must be at least 8 characters long");
    }

    if (usernameErrors.length > 0 || passwordErrors.length > 0) {
      let errorMsg = "";
      if (usernameErrors.length > 0) {
        errorMsg += "Username requirements:\n" + usernameErrors.join("\n") + "\n";
      }
      if (passwordErrors.length > 0) {
        errorMsg += "Password requirements:\n" + passwordErrors.join("\n");
      }
      setError(errorMsg.trim());
      return;
  }

  setLoadingSignup(true);
  setLoadingLogin(false);

  try {
    const res = await apiSignup(username, password);
    setSuccess(res.message || "Account created, please login.");
  } catch (err) {
    setError(err.message || "Signup failed");
  } finally {
    setLoadingSignup(false);
  }
};



  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") {
      if (field === "username") {
        passwordRef.current.focus();
      } else if (field === "password") {
        handleLogin();
      }
    }
  };

  return (
    <div className="app dark-theme">
      {/* Background */}
      <div className="background">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={18}
          lightColor="#888"
          speed={2}
          noiseIntensity={1.5}
          scale={0.25}
          rotation={0}
        />
      </div>

      <div className="heading-section">
        <StarBorder as="div" className="star-border" color="grey" speed="5s">
          <TextType
            text={["Welcome to our Admin Page"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
            className="heading-text"
          />
        </StarBorder>
      </div>

      <TargetCursor spinDuration={2} hideDefaultCursor={true}>
        <div className="login-section">
          <StarBorder as="div" className="login-box" color="grey" speed="5s">
            <input
              type="text"
              placeholder="Username"
              className="login-input"
              value={username}
              ref={usernameRef}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "username")}
            />

            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="login-input"
                value={password}
                ref={passwordRef}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "password")}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <img
                  src={showPassword ? HidePassword : ShowPassword}
                  alt={showPassword ? "Hide password" : "Show password"}
                  className="toggle-password-icon"
                />
              </span>
            </div>

            {/* Error / Success messages */}
            {error && <div className="error-text">{error}</div>}
            {success && <div className="success-text">{success}</div>}

            <div className="login-buttons">
              <StarBorder
                as="button"
                className="login-btn"
                color="grey"
                speed="5s"
                onClick={handleLogin}
                disabled={loadingLogin || loadingSignup}
              >
                {loadingLogin ? "Processing..." : "Login"}
              </StarBorder>

              <StarBorder
                as="button"
                className="login-btn"
                color="grey"
                speed="5s"
                onClick={handleSignup}
                disabled={loadingLogin || loadingSignup}
              >
                {loadingSignup ? "Processing..." : "Signup"}
              </StarBorder>
            </div>
          </StarBorder>
        </div>
      </TargetCursor>
    </div>
  );
}

export default App;
