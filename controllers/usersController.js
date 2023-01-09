const User = require("../models/User")
const bcrypt = require('bcrypt');
// GET 
const getallUsers = async(req,res)=>{
    const users = await User.find().select("-password").lean()
    if(!users?.length){
        return res.status(400).json({message:"User Not Found"})
    }
    res.json(users)
}
// CREATE 
const createUser = async(req,res)=>{
    const{username,password,roles,teams} = req.body
    if (!username||!password){
        return res.status(400).json({message:"All Field Are Require"})
    }
    const duplicate = await User.findOne({username}).collation({locale:"en",strength:2}).lean().exec()
    if(duplicate){
        return res.status(409).json({message:"Duplicate username"})
    }

    const hashedPwd = await bcrypt.hash(password,10)
    const userObject = {username,"password":hashedPwd,roles,teams}

    const user = await User.create(userObject)

    if(user){
        res.status(201).json({message:`New user ${username} created`})
    }else{
        res.status(400).json({message:`Invalid user data recived`})
    }
}
// PATCH
const updateUser = (req,res) =>{
    const{id,username,password,roles,teams,active} = req.body
    if (!id||!username||!Array.isArray(roles)||!roles.length||typeof active !== "boolean"||!!Array.isArray(teams)){
        return res.status(400).json({message:"All Field Except Teams Are Require"})
    }
}
// DELETE 

module.exports = {getallUsers,createUser}