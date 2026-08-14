import express from 'express'
import dotenv from 'dotenv';
import { connectDB } from "./src/config/db.js";
import app from './src/app.js';
// const app = express();
dotenv.config();

const PORT = process.env.PORT;
connectDB();



app.get("/", (req, res) => {
  res.send("Server is working");
});

app.get('/health', (req, res)=>{
    res.status(200).json({ status: 'ok', timestamp: Date.now() })
});

const server = app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})
