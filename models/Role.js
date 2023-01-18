const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    rolename:{
        type:String,
        require:true,
    }
})

module.exports = mongoose.model("Role",roleSchema)