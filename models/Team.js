const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamname:{
        type:String,
        require:true
    },
    manager:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User"
    },
    member:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    project:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    }]
})

module.exports = mongoose.model("Team",teamSchema)