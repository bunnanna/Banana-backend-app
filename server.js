require("dotenv").config()
require("express-async-errors")
const cookieParser = require("cookie-parser");
const express = require('express');
const app = express()
const path = require('path');
const connectDB = require("./config/connDB");
const mongoose = require('mongoose');
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 5000

// Connect Database
mongoose.set("strictQuery",false)
connectDB()

// Logging
const {logEvents,logger}=require("./middleware/logger")
app.use(logger)

// Cookie
app.use(cookieParser())
// CORS 
const cors = require('cors');
const corsOptions = require("./config/corsOptions");
app.use(cors(corsOptions))
// JSON 
app.use(express.json())

// PUBLIC 
app.use("/",express.static(path.join(__dirname,"public")))

// ROUTE 
// root
app.use("/",require("./routes/root"))
// users 
app.use("/users",require("./routes/userRoutes"))

// roles 
app.use("/roles",require("./routes/roleRoutes"))

// tasks 
app.use("/tasks",require("./routes/taskRoutes"))

// teams 
app.use("/teams",require("./routes/teamRoutes"))

// skills 
app.use("/skills",require("./routes/skillRoutes"))

// projects 
app.use("/projects",require("./routes/projectRoutes"))

// auth 
app.use("/auth",require("./routes/authRoutes"))

// ERROR ROUTE 
app.all("*",(req,res)=>{
    res.status(404)
    if(req.accepted("html")){
        res.sendFile(__dirname,"views","404.html")
    }else if (req.accepted("json")){
        res.json({message:"404 Not Found"})
    }else{
        res.type("txt").send("404 Not Found")
    }
})

// ERRORHANDLER 
app.use(errorHandler)

// MONGOOSE LISTENNER
mongoose.connection.once("open",()=>{
    console.log("Connected")
    app.listen(PORT,()=>{
    console.log(`Starting Server ${PORT}`)
})
})

// MONGOOSE CONNECTION ERROR 
mongoose.connection.on("error",err=>{
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,"mongoErrLog.log")
})

