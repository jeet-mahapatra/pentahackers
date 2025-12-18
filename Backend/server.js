import express from 'express';
import connectDB from './config/db.js';

// connect mongodb
connectDB();

const app = express();

app.get('/', (req, res)=>{
    res.send("Hello World.");
})

const PORT = process.env.PORT || 6000

app.listen(PORT,()=>{
    console.log(`Server Started on http://localhost:${PORT}`)
})