import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./config/Connectdb.js";
import cookieParser from "cookie-parser";
import inStituteauth from './routes/institute.auth.route.js'
if(process.env.NODE_ENV !== "production"||!process.env.NODE_ENV){ 
import('./config/db_queries/CreateTable.js')
import('./config/db_queries/Migrate_20251103.js')
}

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

//? CORS Middleware
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error("Origin not allowed by CORS  "));
      }
    },
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

//? middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/institute/auth',inStituteauth)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
