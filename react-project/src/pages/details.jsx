import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Beams from "../components/beams.jsx";
import StarBorder from "../components/starBorder.jsx";
import ShinyText from "../components/shinyText.jsx";
import UserLogo from "../assets/userLogo.png";
import { removeAuth } from "../AuthRoutes/auth";
import "./details.css";

export default function Details() {
  const { id } = useParams(); // username
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false); // 🔹 for Ban/Unban button loading

  useEffect(() => {
    fetchPlayer();
  }, [id]);

  async function fetchPlayer() {
    setLoading(true);
    try {
      const res = await fetch("https://api.pulkitworks.info/users/details/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: id }),
      });

      const data = await res.json();

      if (data && data.success && data.user) {
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

  // 🔹 Function to Ban the player
  async function handleBan() {
    if (!player?.username) return;
    setProcessing(true);
    try {
      const res = await fetch("https://api.pulkitworks.info/users/ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: player.username }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`✅ ${player.username} has been banned.`);
        navigate("/home");
      } else {
        alert(`⚠️ Failed to ban: ${data.message}`);
      }
    } catch (err) {
      console.error("Ban Error:", err);
      alert("❌ Error banning player.");
    } finally {
      setProcessing(false);
    }
  }

  // 🔹 Function to Unban the player
  async function handleUnban() {
    if (!player?.username) return;
    setProcessing(true);
    try {
      const res = await fetch("https://api.pulkitworks.info/users/unban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: player.username }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`✅ ${player.username} has been unbanned.`);
        navigate("/home");
      } else {
        alert(`⚠️ Failed to unban: ${data.message}`);
      }
    } catch (err) {
      console.error("Unban Error:", err);
      alert("❌ Error unbanning player.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="details-root">
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
                <ShinyText text={`Player Name: ${player.playername}`} speed={3} className="shiny-line" />
                <ShinyText text={`Username: ${player.username}`} speed={3} className="shiny-line" />
                <ShinyText text={`Level: ${player.level}`} speed={3} className="shiny-line" />
                <ShinyText text={`Coins: ${player.coins}`} speed={3} className="shiny-line" />
                <ShinyText text={`Enemies Defeated: ${player.EnemiesDefeated}`} speed={3} className="shiny-line" />
                <ShinyText text={`Account Status: ${player.accountStatus}`} speed={3} className="shiny-line" />
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

          {/* 🔹 Ban / Unban Button */}
          {!loading && player && (
            <>
              {player.accountStatus === "banned" ? (
                <button
                  className="btn"
                  style={{ backgroundColor: "green" }}
                  onClick={handleUnban}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Unban Player"}
                </button>
              ) : (
                <button
                  className="btn"
                  style={{ backgroundColor: "red" }}
                  onClick={handleBan}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Ban Player"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
