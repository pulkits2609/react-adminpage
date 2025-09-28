import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, removeAuth } from "../AuthRoutes/auth.js";

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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Refs for inputs
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await apiLogin(username, password);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeAuth();
    navigate("/", { replace: true });
  };

  // Handle Enter key press
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
      {/* Background Beams Effect */}
      <div className="background">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={18}
          lightColor= "#888"      // muted grey light
          speed={2}
          noiseIntensity={1.5}
          scale={0.25}
          rotation={0}
        />
      </div>

      {/* Blur text inside GlareHover (top-right) */}
      <div className="blurtext-container">
        <GlareHover
          glareColor="#888"
          glareOpacity={0.3}
          glareAngle={-30}
          glareSize={300}
          transitionDuration={800}
          playOnce={false}
          className="glare-wrapper"
        >
          <div className="blur-box">
            <BlurText
              text="Download our game from here!"
              delay={100}
              animateBy="words"
              direction="top"
              className="blur-text"
            />
          </div>
        </GlareHover>
      </div>

      {/* Heading Section */}
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

            {error && <div className="error-text">{error}</div>}

            <div className="login-buttons">
              <StarBorder
                as="button"
                className="login-btn"
                color="grey"
                speed="5s"
                onClick={handleLogin}
              >
                {loading ? "Logging in..." : "Login"}
              </StarBorder>

              <StarBorder
                as="button"
                className="login-btn"
                color="grey"
                speed="5s"
              >
                Signup
              </StarBorder>
            </div>
          </StarBorder>
        </div>
      </TargetCursor>
    </div>
  );
}

export default App;
