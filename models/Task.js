const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    projectname:{
        type:String,
        require:true
    },
    taskname:{
        type:String,
        require:true
    },
    teams:{
        type:[String],
        default:[]
    },
    skills:{
        type:[String],
        default:[]
    },
    description:{
        type:String,
        default:""
    },
    checklist:{
        type:[
            {
                "check":Boolean,
                "subtask":String
            }
        ],
        default:[]
    },
    complete:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("Task",taskSchema)