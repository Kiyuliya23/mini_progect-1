import express from "express";
import   "dotenv/config";
import authRouter from "./routers/auth.js";
import postRouter from "./routers/posts.js";


const app = express();
const PORT = process.env.PORT || 3333

app.use(express.json());








//1. /auth/regidter   2./auth/login
app.use("/auth", authRouter);
app.use("/posts", postRouter);



app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
 });