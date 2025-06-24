import app from "./app.js";
import dotenv from "dotenv";  
import db from "./db/db.js"
import userRoutes from "./routes/user_route.js"

dotenv.config({ path: './.env' });

const port = process.env.PORT || 8000;

app.use('/api/v1/users', userRoutes);

db();

app.listen(port, () =>{
    console.log(`Server is listening on ${port}`);
})