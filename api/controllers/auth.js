import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = (req, res) => {
  // Check if the username already exists
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      return res.status(409).json("Username already exists");
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // Insert the new user
    const insertQuery =
      "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?)";

    db.query(
      insertQuery,
      [[req.body.username, req.body.email, hashedPassword, req.body.name]],
      (err, result) => {
        if (err) return res.status(500).json({ message: err });

        return res.status(201).json("User created");
      }
    );
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json("User not found");
    }

    if (!bcrypt.compareSync(req.body.password, result[0].password)) {
      return res.status(401).json("Invalid username or password");
    }

    const token = jwt.sign({ id: result[0].id }, "secretkey");

    const { password, ...user } = result[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(user);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "None",
    })
    .status(200)
    .json("Logged out");
};
