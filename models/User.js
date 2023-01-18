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
        type:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role",
        }],
        default:["63c79e03e1d02be7d9e920c9"]
    },
    teams:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team"
    }],
    skills:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Skill"
    }],
    active:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model("User",userSchema)