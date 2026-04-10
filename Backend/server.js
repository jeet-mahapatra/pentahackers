import express from 'express';
import 'dotenv/config';

import connectToMongo from './config/db.js';
import authRouter from './router/auth.js';

// connect mongodb
connectToMongo();

const app = express();
const PORT = process.env.PORT || 6000;

app.use('api/auth', authRouter);


app.get('/', (req, res)=>{
    res.send("Hello World.");
})



app.listen(PORT,()=>{
    console.log(`Example app listening on port ${PORT}`);
})