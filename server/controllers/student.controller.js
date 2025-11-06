import { client } from "../config/Connectdb.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../config/cookieoption.js";
import { paymentIntent } from "../services/stripepayment.service.js";
export const login= async (req,res)=>{

const { Gmail, password } = req.body;

if (!Gmail || !password) {
  return res.status(400).json({ message: "Gmail and password are required" });
}

try {
 
  const result = await client.query(
    "SELECT * FROM student WHERE email = $1",
    [Gmail]
  );
  if (result.rows.length === 0) {
    return res.status(401).json({ message: "Invalid Gmail or password" });
  }
  const student = result.rows[0];
  const hashedPassword = student.password;
  const verify = await bcrypt.compare(password, hashedPassword);
  if (!verify) {
    return res.status(401).json({ message: "Invalid Gmail or password" });
  }
  // Generate JWT token
  const token = jwt.sign({ Gmail: student.email }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
  res.cookie("token", token, cookieOptions);
  res.setHeader("Authorization", `Bearer ${token}`);

  const { password: _removed, ...studentData } = student;
  return res.status(200).json({ message: "Login successful", student: studentData });
} catch (error) {
  console.error(error);
  return res.status(500).json({ message: "Internal server error", error: error?.message });
}
}


export const getStudent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "Invalid user data" });
    }
    return res.status(200).json({ student: req.user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error?.message });
  }
};

export const initiatePayment = async (req,res)=>{
    try {
        const {amount} = req.body;
        if(!amount||amount<50) return res.status(400).json({message:"amount is required or must be greater than 50"});
        const paymentIntentCreated = await paymentIntent(amount);        
        res.status(200).json({clientSecret:paymentIntentCreated.client_secret});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message})
        
    }
}