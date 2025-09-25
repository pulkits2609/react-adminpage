import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, removeAuth } from "../AuthRoutes/auth.js"; // <- new import

import BlurText from "../components/blurText.jsx";
import TextType from "../components/textType.jsx";
import StarBorder from "../components/starBorder";
import Beams from "../components/beams.jsx";
import GlareHover from "../components/glareHover.jsx";
import TargetCursor from "../components/TargetCursor.jsx";
import "./App.css"

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // If your backend sets cookies (session), pass { credentials: true }
      // e.g. apiLogin(username, password, { credentials: true })
      const res = await apiLogin(username, password);

      // If apiLogin resolves -> success path
      // your auth.js already saved loggedIn:true
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeAuth();
    // optional UI feedback
    navigate("/", { replace: true });
  };

  return (
    <>
      <div className="app">
        {/* Background Beams Effect */}
        <div className="background">
          <Beams
            beamWidth={2}
            beamHeight={15}
            beamNumber={12}
            lightColor="#00ffff" // cyan glow
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={0}
          />
        </div>

        {/* Blur text inside GlareHover (top-right) */}
        <div className="blurtext-container">
          <GlareHover
            glareColor="#00ffff"
            glareOpacity={0.4}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={800}
            playOnce={false}
            className="glare-wrapper"
          >
            <div className="blur-box">
              <BlurText
                text="Download our game from here !"
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
          <StarBorder
            as="div"
            className="star-border"
            color="cyan"
            speed="5s"
          >
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
            <StarBorder as="div" className="login-box" color="cyan" speed="5s">
              <input
                type="text"
                placeholder="Username"
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <div className="error-text">{error}</div>}

              <div className="login-buttons">
                <StarBorder
                  as="button"
                  className="login-btn"
                  color="cyan"
                  speed="5s"
                  onClick={handleLogin}
                >
                  {loading ? "Logging in..." : "Login"}
                </StarBorder>

                <StarBorder
                  as="button"
                  className="login-btn"
                  color="cyan"
                  speed="5s"
                  // signup not wired yet
                >
                  Signup
                </StarBorder>
              </div>
            </StarBorder>
          </div>
        </TargetCursor>
      </div>
    </>
  );
}

export default App;
