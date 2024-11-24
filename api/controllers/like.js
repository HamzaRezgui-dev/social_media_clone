import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getLikes = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  const q = `SELECT userId FROM likes WHERE postId = ?`;

  db.query(q, [req.query.postId], (err, result) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(result.map((r) => r.userId));
  });
};

export const addLike = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid token");
    const q = "INSERT INTO likes (`postId`, `userId`) VALUES (?)";

    const values = [req.body.postId, data.id];
    db.query(q, [values], (err, result) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Like has been added");
    });
  });
};

export const deleteLike = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("User not logged in");
    
    jwt.verify(token, "secretkey", (err, data) => {
        if (err) return res.status(403).json("Invalid token");
        const q = `DELETE FROM likes WHERE postId = ? AND userId = ?`;
    
        db.query(q, [req.query.postId, data.id], (err, result) => {
        if (err) return res.status(500).json(err);
    
        return res.status(204).json("Like has been deleted");
        });
    });
};
