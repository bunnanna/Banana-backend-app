const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    project:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"Project"
    },
    taskname:{
        type:String,
        require:true
    },
    teams:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team"
    }],
    skills:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Skill"
    }],
    description:{
        type:String,
        default:""
    },
    checklists:{
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
    },
    status:{
        type:String,
        default:"assign"
    },
    activity:{
        type:[{
            "username":{
                type:mongoose.Schema.Types.ObjectId,
                require:true,
                ref:"User"
            },
            "action":String,
            "timestamps":{
                type:Date,
                default:Date.now(),
            }
        }],
        default:[]
    },
    dateline:{
        type:Date,
        default : new Date(8640000000000000) 
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Task",taskSchema)