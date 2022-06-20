require('dotenv').config();
const PORT = process.env.port || 5000
const express = require("express");
const IOconnect = require('./SocketIO/index');
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const router = require('./routers/index');
const errorMiddleware = require('./middleware/error-midleware');
const {graphqlHTTP} = require('express-graphql')
const schema = require('./graphql/schema')
const root = require('./graphql/index')
const app = express()
const jwt = require('jsonwebtoken')
const tokenService = require('./service/token-service');
const ApiError = require('./exceptions/api-error');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.use(function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
        const userData = tokenService.validateAccessToken(socket.handshake.query.token);
        if (userData===null) {
            return next(ApiError.UnauthorizedError());
        }
        socket.user = userData;
        next();
    }
    else {
      next(ApiError.UnauthorizedError());
    }    
  })
  .on("connection", (socket)=>IOconnect(socket,io));

app.use('/graphql', graphqlHTTP({
    graphiql:true,
    schema,
    rootValue: root
}))
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
        mongoose.Promise = global.Promise;
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
        server.listen(PORT,()=>{
            console.log("Server run in port 5000")
        })    
    } catch (error) {
        console.log(error)
    }
}

start()
