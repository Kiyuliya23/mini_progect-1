import express from "express";
import   "dotenv/config";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/posts.js";
import { connectToDatabase } from "./db/config.js";


const app = express();
const PORT = process.env.PORT || 3333

app.use(express.json());

//1. /auth/regidter   2./auth/login
app.use("/auth", authRouter);
app.use("/posts", postRouter);



app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
 });