import { client } from "../config/Connectdb";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { cookieOptions } from "../config/cookieoption.js";

export const InstituteLogin = async (req, res) => {
  const { Gmail, password } = req.body;
  const result = await client.query(
    "SELECT * FROM university WHERE Gmail = $1 ",
    [Gmail]
  );
  if (result.rows.length === 0) {
    return res.status(401).json({ message: "Invalid Gmail or password" });
  }
  const user = result.rows[0];
  const hasshedPassword = user.password;
  const verify = await bcrypt.compare(password, hasshedPassword);
  if (!verify)
    return res.status(401).json({ message: "Invalid Gmail or password" });
  const token = jwt.sign({ Gmail: user.Gmail }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token",token,cookieOptions);
  res.setHeader("Authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "Login successful", user });
}