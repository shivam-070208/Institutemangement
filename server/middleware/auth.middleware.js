import jwt from "jsonwebtoken";
import { client } from "../config/Connectdb.js";
export const isInstituteAuth = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const Gmail = decoded?.Gmail;
    if (!Gmail) return res.status(400).json({ message: "not a valid token" });

    const query = `
        select * from university where Gmail = $1;
        `;
    const user = await client.query(query, [Gmail]);

    if (!user.rows)
      return res.status(401).json({ message: "invalid token provided" });
    req.user = user.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


export const isStudentAuth = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if(!token) return res.status(401).json({ message: "Unauthorized" } );
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const Gmail = decoded?.Gmail;
  if(!Gmail)return res.status(400).json({ message: "not a valid token" });
  const query = `
  select * from student where email = $1;
  `;
  const user = await client.query(query, [Gmail])
  if(!user) return res.status(404).json({message:"user not found"});
  req.user = user.rows[0];
  next();
}
