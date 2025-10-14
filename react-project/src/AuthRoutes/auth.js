// src/AuthRoutes/auth.js

// const BASE_URL = "https://api.pulkitworks.info"; //API Base URL
const BASE_URL = "https://api.pulkitworks.info"; //API Base URL
const AUTH_KEY = "my_app_auth_v1"; // localStorage key

// --- Auth state helpers ---
export function setAuth(obj) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(obj));
}

export function getAuth() {
  const s = localStorage.getItem(AUTH_KEY);
  return s ? JSON.parse(s) : null;
}

export function removeAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated() {
  const a = getAuth();
  return !!(a && (a.token || a.loggedIn));
}

// --- Login ---
export async function login(username, password, options = {}) {
  const { timeout = 7000, credentials = false } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      signal: controller.signal,
      credentials: credentials ? "include" : "omit",
    });

    clearTimeout(id);

    const data = await res.json().catch(() => {
      throw new Error("Invalid JSON received from server");
    });

    if (!res.ok) {
      throw new Error(data?.message || res.statusText || "Login failed");
    }

    if (data.success) {
      setAuth({ username, loggedIn: true, message: data.message });
      return data;
    } else {
      throw new Error(data.message || "Invalid credentials");
    }
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// --- Signup ---
export async function signup(username, password, options = {}) {
  const { timeout = 7000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      signal: controller.signal,
    });

    clearTimeout(id);

    const data = await res.json().catch(() => {
      throw new Error("Invalid JSON received from server");
    });

    if (!res.ok) {
      throw new Error(data?.message || res.statusText || "Signup failed");
    }

    if (data.success) {
      return { success: true, message: "Account created, please login" };
    } else {
      throw new Error(data.message || "Signup failed");
    }
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}


// --- New helpers for Home page ---

/** Get total users count */
export async function getTotalUsers() {
  const res = await fetch(`${BASE_URL}/users/total`);
  if (!res.ok) throw new Error("Failed to fetch total users");
  const data = await res.json();
  return data.totalUsers ?? 0;
}

/** Get active users count (length of online array) */
export async function getActiveUsers() {
  const res = await fetch(`${BASE_URL}/users/online`);
  if (!res.ok) throw new Error("Failed to fetch active users");
  const data = await res.json();
  return Array.isArray(data.online) ? data.online.length : 0;
}

/** Ban a specific user */
export async function banUserByName(username) {
  const res = await fetch(`${BASE_URL}/users/ban`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error("Failed to ban user");
  return res.json();
}

export async function getAllUserDetails() {
  const res = await fetch(`${BASE_URL}/users/details`);
  if (!res.ok) throw new Error("Failed to fetch user details");
  const data = await res.json();
  return Array.isArray(data.users) ? data.users : [];
}

/** Get details of banned users */
export async function getBannedUserDetails() {
  const url = `${BASE_URL}/users/banned`;
  try {
    const res = await fetch(url, { method: "GET" });

    if (!res.ok) {
      throw new Error(`Failed to fetch banned users (${res.status})`);
    }

    const data = await res.json();

    // normalize possible shapes
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.users)) return data.users;
    if (Array.isArray(data.banned)) return data.banned;
    if (Array.isArray(data.data)) return data.data;

    // fallback: try to find first array in object
    for (const key of Object.keys(data)) {
      if (Array.isArray(data[key])) return data[key];
    }

    return [];
  } catch (err) {
    throw err;
  }
}
