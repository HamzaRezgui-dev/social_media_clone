import moment from "moment";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getPosts = async (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid token");
    const q = userId
      ? `SELECT p.*, u.id AS userId, name, profilePic 
    FROM posts AS p JOIN users 
    AS u ON p.userId = u.id WHERE p.userId = ? `
      : `SELECT p.*, u.id AS userId, name, profilePic 
    FROM posts AS p JOIN users AS u ON p.userId = u.id 
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) 
    WHERE r.followerUserId = ? OR p.userId = ?
    ORDER BY p.createdAt DESC`;

    const values = userId ? [userId] : [data.id, data.id];

    db.query(q, values, (err, result) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(result);
    });
  });
};

export const addPost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid token");
    const insertQuery =
      "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      data.id,
    ];
    db.query(insertQuery, [values], (err, result) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Post has been created");
    });
  });
};
