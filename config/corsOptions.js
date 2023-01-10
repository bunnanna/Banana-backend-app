const allowOrigins = require("./allowedOrigin");
const corsOptions ={
    origin:(origin,callback)=>{
        if (allowOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error("Not Allowed By CORS"))
        }
    },
    credentials:true,
    optionsSuccessStatus:200
}

module.exports = corsOptions