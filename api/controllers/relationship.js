import { db } from "../connect.js";
import jwt from "jsonwebtoken";
export const getRelationships = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  const q = `SELECT followerUserId FROM relationships WHERE followedUserId = ?`;

  db.query(q, [req.query.followedUserId], (err, result) => {
    if (err) return res.status(500).json(err);

    return res
      .status(200)
      .json(result.map((relationship) => relationship.followerUserId));
  });
};
export const addRelationship = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid token");
    const insertQuery =
      "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";

    const values = [data.id, req.body.userId];
    db.query(insertQuery, [values], (err, result) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Following");
    });
  });
};
export const deleteRelationship = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("User not logged in");

  jwt.verify(token, "secretkey", (err, data) => {
    if (err) return res.status(403).json("Invalid token");
    const deleteQuery =
      "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(deleteQuery, [data.id, req.query.userId], (err, result) => {
      if (err) return res.status(500).json(err);

      return res.status(204).json("Unfollowed");
    });
  });
};
