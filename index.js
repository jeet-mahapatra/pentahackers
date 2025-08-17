const express = require('express');
const connectToMongo = require('./db');

// connect mongodb
connectToMongo();

const app = express();

app.get('/', (req, res)=>{
    res.send("Hello World");
})

app.listen(5000);