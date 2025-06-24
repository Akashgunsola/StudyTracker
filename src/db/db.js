import mongoose from "mongoose";
import dotenv, { configDotenv } from "dotenv"
dotenv.config({path: './.env'})

const db_url = process.env.DB_URL

const db = (() => {
    mongoose.connect(db_url)
    .then(() => {
        console.log("Database connection estblished sucessfully");
    })

    .catch((error => {
        console.log("Error connecting to DB", error)

    }
    ))

})

export default db;