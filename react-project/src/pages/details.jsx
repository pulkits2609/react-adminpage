// src/pages/Details.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Beams from "../components/beams.jsx";
import StarBorder from "../components/starBorder.jsx";
import ShinyText from "../components/shinyText.jsx";
import UserLogo from "../assets/userLogo.png";

import { removeAuth } from "../AuthRoutes/auth";
import "./Details.css";

export default function Details() {
  const { id } = useParams();          // player ID from URL
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPlayer();
  }, [id]);

  async function fetchPlayer() {
    setLoading(true);
    try {
      const res = await fetch(`http://65.0.20.31:3000/users/details/${id}`);
      const data = await res.json();

      if (data && data.user) {
        setPlayer(data.user);
      } else {
        setMessage("⚠️ Player not found");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to load player details");
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    navigate("/home");
  }

  function handleLogout() {
    removeAuth();
    navigate("/", { replace: true });
  }

  return (
    <div className="details-root">
      {/* Background */}
      <div className="details-background">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#00ffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>

      <div className="details-content">
        {loading ? (
          <div className="loading">Loading player details...</div>
        ) : message ? (
          <div className="error">{message}</div>
        ) : (
          <StarBorder as="div" className="player-card" color="cyan" speed="5s">
            <div className="player-card-content">
              <div className="player-card-left">
                <img
                  src={UserLogo}
                  alt="Player avatar"
                  className="player-card-image"
                />
              </div>
              <div className="player-card-right">
                <ShinyText
                  text={`Player Name: ${player.playername}`}
                  speed={3}
                  className="shiny-line"
                />
                <ShinyText
                  text={`Username: ${player.username}`}
                  speed={3}
                  className="shiny-line"
                />
                <ShinyText
                  text={`Level: ${player.level}`}
                  speed={3}
                  className="shiny-line"
                />
                <ShinyText
                  text={`Coins: ${player.coins}`}
                  speed={3}
                  className="shiny-line"
                />
                <ShinyText
                  text={`Enemies Defeated: ${player.EnemiesDefeated}`}
                  speed={3}
                  className="shiny-line"
                />
                <ShinyText
                  text={`Account Status: ${player.accountStatus}`}
                  speed={3}
                  className="shiny-line"
                />
              </div>
            </div>
          </StarBorder>
        )}

        <div className="details-actions">
          <button className="btn ghost" onClick={handleBack}>
            ⬅ Back
          </button>
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
