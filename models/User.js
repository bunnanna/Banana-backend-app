const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    roles:{
        type:[String],
        default:["Employee"]
    },
    teams:{
        type:[String],
        default:[]
    },
    skills:{
        type:[String],
        default:[]
    },
    active:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model("User",userSchema)