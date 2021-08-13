require('dotenv').config();
const PORT = process.env.port || 5000
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const router = require('./routers/index');
const errorMiddleware = require('./middleware/error-midleware');

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin: 'http://localhost:3000',
}))
app.use('/api',router)
app.use(errorMiddleware)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT,()=>{
            console.log("Server run in port 5000")
        })    
    } catch (error) {
        console.log(error)
    }
}

start()