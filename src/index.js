import app from "./app.js";
import dotenv from "dotenv";  
import db from "./db/db.js"


dotenv.config({ path: './.env' });

const port = process.env.PORT || 8000;


db();


app.listen(port, () =>{
    console.log(`Server is listening on ${port}`);
})