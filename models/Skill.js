const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    skill:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model("Skill",skillSchema)