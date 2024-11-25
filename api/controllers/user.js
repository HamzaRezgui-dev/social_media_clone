import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getUser = async (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id = ?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.status(200).json(info);
  });
};

export const updateUser = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid token");
    const updateQuery =
      "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePic`=?, `coverPic`=?  WHERE id = ?";

    const values = [
      req.body.name,
      req.body.city,
      req.body.website,
      req.body.profilePic,
      req.body.coverPic,
      data.id,
    ];
    db.query(updateQuery, values, (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows > 0) return res.status(200).json("Updated");
      return res.status(403).json("You can only update only your profile");
    });
  });
};
