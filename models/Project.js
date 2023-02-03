const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectname:{
        type:String,
        require:true
    },
    tasks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task"
    }],
    manager:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User"
    },
    teams:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team"
    }],
    complete:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("Project",projectSchema)