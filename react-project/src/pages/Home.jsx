// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StarBorder from "../components/starBorder";
import Beams from "../components/beams.jsx";
import ShinyText from "../components/shinyText.jsx";
import UserLogo from "../assets/userLogo.png";

import {
  getAuth,
  removeAuth,
  getTotalUsers,
  getActiveUsers,
  getBannedUserDetails,
  getAllUserDetails,
} from "../AuthRoutes/auth";
import "./Home.css";

export default function Home() {
  const auth = getAuth();
  const username = auth?.username || "Player";
  const navigate = useNavigate();

  const [stats, setStats] = useState({ active: "--", total: "--" });
  const [users, setUsers] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadStats();
    loadUsers();
    loadBanned();
  }, []);

  async function loadUsers() {
    try {
      const list = await getAllUserDetails();
      setUsers(list);
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to load user details");
    }
  }

  async function loadStats() {
    setLoading(true);
    try {
      const [activeCount, totalCount] = await Promise.all([
        getActiveUsers(),
        getTotalUsers(),
      ]);
      setStats({ active: activeCount, total: totalCount });
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to load stats");
    } finally {
      setLoading(false);
    }
  }

  async function loadBanned() {
    setMessage("");
    try {
      const list = await getBannedUserDetails();
      setBannedUsers(list || []);
    } catch (err) {
      console.error("loadBanned error:", err);
      setMessage("⚠️ Failed to load banned users");
      setBannedUsers([]);
    }
  }

  function handleLogout() {
    removeAuth();
    navigate("/", { replace: true });
  }

  return (
    <div className="home-root">
      {/* 🔥 Background */}
      <div className="home-background">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#888"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>

      {/* Content */}
      <div className="home-content">
        <header className="home-header">
          <StarBorder as="div" className="home-title" color="cyan" speed="5s">
            <div className="title-inner">
              <h1>Welcome back, {username}</h1>
              <p className="subtitle">Server overview</p>
            </div>
          </StarBorder>

          <div className="header-actions">
            <button
              className="btn"
              onClick={() => {
                loadStats();
                loadUsers();
                loadBanned();
              }}
              disabled={loading}
            > 
              {loading ? "Refreshing…" : "Refresh Stats"}
            </button>
            <button className="btn ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {message && <div className="message">{message}</div>}

        <main className="home-main">
          {/* Stats cards */}
          <section className="cards-grid">
            <div className="card">
              <div className="card-title">Active Users</div>
              <div className="card-value">{stats.active}</div>
            </div>

            <div className="card">
              <div className="card-title">Total Users</div>
              <div className="card-value">{stats.total}</div>
            </div>
          </section>

          {/* Active users rectangular grid */}
          <section className="user-grid-container">
            <h2 style={{ marginBottom: "12px" }}>Active Users</h2>

            {users.length === 0 ? (
              <div className="empty">No users found</div>
            ) : (
              users.map((u) => (
                <StarBorder
                  key={u._id}
                  as="div"
                  className="user-card clickable"
                  color="cyan"
                  speed="5s"
                  onClick={() => navigate(`/details/${u.username}`)} //this redirects
                >
                  <div className="user-card-content">
                    <div className="user-card-left">
                      <img
                        src={UserLogo}
                        alt="User avatar"
                        className="user-card-image"
                      />
                    </div>
                    <div className="user-card-right">
                      <ShinyText
                        text={`Player: ${u.playername}`}
                        speed={3}
                        className="shiny-line"
                      />
                      <ShinyText
                        text={`Username: ${u.username}`}
                        speed={3}
                        className="shiny-line"
                      />
                      <ShinyText
                        text={`Status: ${
                          u.onlineStatus ? "Online 🟢" : "Offline 🔴"
                        }`}
                        speed={3}
                        className="shiny-line"
                      />
                    </div>
                  </div>
                </StarBorder>
              ))
            )}
          </section>

          {/* Banned users rectangular grid */}
          <section className="user-grid-container">
            <h2 style={{ marginBottom: "12px" }}>Banned Users</h2>

            {bannedUsers.length === 0 ? (
              <div className="empty">No banned users</div>
            ) : (
              bannedUsers.map((u) => (
                <StarBorder
                  key={u._id}
                  as="div"
                  className="user-card banned clickable"
                  color="red"
                  speed="5s"
                  onClick={() => navigate(`/details/${u.username}`)}
                >
                  <div className="user-card-content">
                    <div className="user-card-left">
                      <img
                        src={UserLogo}
                        alt="Banned avatar"
                        className="user-card-image"
                      />
                    </div>
                    <div className="user-card-right">
                      <ShinyText
                        text={`Player: ${u.playername}`}
                        speed={3}
                        className="shiny-line"
                      />
                      <ShinyText
                        text={`Username: ${u.username}`}
                        speed={3}
                        className="shiny-line"
                      />
                      <ShinyText
                        text={`Account Status: ${u.accountStatus}`}
                        speed={3}
                        className="shiny-line"
                      />
                    </div>
                  </div>
                </StarBorder>
              ))
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
