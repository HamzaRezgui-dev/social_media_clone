import { db } from "../connect.js";
import moment from "moment";
import jwt from "jsonwebtoken";
export const getComments = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  const q = `SELECT c.* , u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON c.userId = u.id WHERE c.postId = ? ORDER BY c.createdAt DESC`;

  db.query(q, [req.query.postId], (err, result) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(result);
  });
};

export const addComment = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid token");
    const insertQuery =
      "INSERT INTO comments (`desc`,`createdAt`, `userId`, `postId`) VALUES (?)";

    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      data.id,
      req.body.postId,
    ];
    db.query(insertQuery, [values], (err, result) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Comment has been created");
    });
  });
};
