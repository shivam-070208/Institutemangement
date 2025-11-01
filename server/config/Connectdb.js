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

export const client = new pg.Client(config);
 client.connect(function (err) {
    if (err)
        throw err;
    client.query("SELECT VERSION()", [], function (err, result) {
        if (err)
            throw err;

        console.log(result.rows[0].version);
        client.end(function (err) {
            if (err)
                throw err;
        });
    });
});