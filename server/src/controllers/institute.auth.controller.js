import { client } from "../../config/Connectdb.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../../config/cookieoption.js";

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
  const token = jwt.sign({ Gmail: user.gmail }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
  
  res.cookie("token", token, cookieOptions);
  res.setHeader("Authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "Login successful", user });
};

export const InstituteSignup = async (req, res) => {
  try {
    const {
      uName,
      Address,
      Type,
      Established_Year,
      Authority,
      Gmail,
      Phone,
      Website,
      Password,
      Admin_Position,
      adminname,
    } = req.body;
    
    if (
      !uName ||
      !Address ||
      !Type ||
      !Established_Year ||
      !Authority ||
      !Gmail ||
      !Phone ||
      !Website ||
      !Password ||
      !Admin_Position ||
      !adminname
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);
    const existingUser = await client.query(
      "SELECT * FROM university WHERE Gmail = $1",
      [Gmail]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    const result = await client.query(
      "INSERT INTO university (uName,Address,Type,Established_Year,Authority,Gmail,Phone,Website,Password,admin_position,adminname) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",
      [
        uName,
        Address,
        Type,
        Established_Year,
        Authority,
        Gmail,
        Phone,
        Website,
        hashedPassword,
        Admin_Position,
        adminname,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Failed to signup" });
    }
    const token = jwt.sign({ Gmail: Gmail }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, cookieOptions);
    res.setHeader("Authorization", `Bearer ${token}`);
    return res
      .status(200)
      .json({ message: "Signup successful", user: result.rows[0] });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
export const getUser = async (req, res) => {
  try {
    
    if (!req.user) {
      return res.status(400).json({ message: "Invalid user data" });
    }
    return res.status(200).json({ user: req.user });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Serever side error" });
  }
};
