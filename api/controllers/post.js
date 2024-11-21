import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getPosts = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid token");
    const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON p.userId = u.id 
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ?
    ORDER BY p.createdAt DESC`;

    db.query(q, [data.id, data.id], (err, result) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(result);
    });
  });
};
