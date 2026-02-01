require("dotenv").config();

const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const db = require("./db");
const { authenticateToken, signToken } = require("./auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const insertUser = db.prepare(
  "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)"
);
const findUserByEmail = db.prepare(
  "SELECT id, email, password_hash, role FROM users WHERE email = ?"
);
const findUserById = db.prepare(
  "SELECT id, email, role, created_at FROM users WHERE id = ?"
);

app.post("/api/register", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, password, and role are required" });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!Array.from(["student", "teacher"]).includes(role)) {
    return res.status(400).json({ error: "Role must be student or teacher" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  const existingUser = findUserByEmail.get(email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ error: "Email is already registered" });
  }

  const passwordHash = bcrypt.hashSync(password, 12);

  try {
    const info = insertUser.run(email.toLowerCase(), passwordHash, role);
    const token = signToken({ sub: info.lastInsertRowid, role });
    const user = findUserById.get(info.lastInsertRowid);
    return res.status(201).json({ token, user });
  } catch (error) {
    return res.status(500).json({ error: "Unable to register user" });
  }
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = findUserByEmail.get(email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isValid = bcrypt.compareSync(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signToken({ sub: user.id, role: user.role });
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});

app.get("/api/me", authenticateToken, (req, res) => {
  const user = findUserById.get(req.user.sub);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json({ user });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
