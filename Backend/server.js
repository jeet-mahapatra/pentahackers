import express from 'express';
import connectToMongo from './config/db.js';

// connect mongodb
connectToMongo();

const app = express();

app.get('/', (req, res)=>{
    res.send("Hello World.");
})

app.listen(5000);