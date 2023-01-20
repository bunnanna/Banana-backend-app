const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    skillname:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model("Skill",skillSchema)