const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      message: "invalid request",
    });
  }
};

app.post("/auth/refresh", async (req, res) => {
  try {
    // For demo: require current app JWT to identify user
    const token = req.cookies.token;
    if (!token) return res.status(401).send("No token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const googleId = decoded.id;
    const entry = userStore.get(googleId);
    if (!entry || !entry.refresh_token)
      return res.status(401).send("No refresh token stored");

    const newTokens = await oauth2Client.refreshToken(entry.refresh_token);
    // newTokens.credentials contains new access_token etc.

    // Optionally update stored refresh_token if rotation occurs:
    if (newTokens.credentials.refresh_token) {
      userStore.set(googleId, {
        refresh_token: newTokens.credentials.refresh_token,
      });
    }

    // Issue a fresh app JWT
    const newAppJwt = jwt.sign(
      { id: googleId, email: decoded.email, name: decoded.name },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("token", newAppJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("refresh error", err);
    res.status(401).send("Refresh failed");
  }
});

module.exports = { authMiddleWare };
