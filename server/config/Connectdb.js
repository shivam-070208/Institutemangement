import * as pg from "pg";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const config = {
    user: process.env.POSTGRESS_USER,
    password: process.env.POSTGRESS_PASSWORD,
    host: process.env.POSTGRESS_HOST,
    port: process.env.POSTGRESS_PORT,
    database: process.env.POSTGRESS_DB,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.POSTGRESS_CA_CERTIFICATE ?? fs.readFileSync("config/db/ca.pem").toString(),
    },
};

// Use a Pool to keep connections open across requests
export const client = new pg.Pool(config);