import jwt from "jsonwebtoken";

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET manquant dans .env");
  return s;
}

export function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: "8h" });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token  = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Token manquant" });
  try {
    req.user = jwt.verify(token, getSecret());
    next();
  } catch (e) {
    res.status(401).json({ error: "Token invalide ou expiré — reconnectez-vous" });
  }
}
