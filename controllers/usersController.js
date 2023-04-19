const User = require("../models/User")
const bcrypt = require('bcrypt');
const { jsonParser } = require("./jsonParser");
// GET 
const getallUsers = async(req,res)=>{
    const filter = jsonParser(req.query) 
    const users = await User.find(filter).select("-password").populate("roles","_id rolename").populate("teams","_id teamname").populate("skills","_id skillname").lean()
    
    res.json(users)
}

// CREATE 
const createUser = async(req,res)=>{
    const{username,password,roles,teams,skills} = req.body
    if (!username||!password){
        return res.status(400).json({message:"All Field Are Require"})
    }
    const duplicate = await User.findOne({username}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate){
        return res.status(409).json({message:"Duplicate username"})
    }

    const hashedPwd = await bcrypt.hash(password,10)
    const userObject = {username,"password":hashedPwd,roles,teams,skills}

    const user = await User.create(userObject)

    if(user){
        res.status(201).json({message:`New user ${username} created`})
    }else{
        res.status(400).json({message:`Invalid user data recived`})
    }
}
// PATCH
const updateUser = async (req,res) =>{
    const{id,username,prvpassword,password,roles,teams,active,skills} = req.body
    if (!id||!username){
        return res.status(400).json({message:"All Field Except Teams Are Require"})
    }
    const user = await User.findById(id).exec()

    const checkpwd = await bcrypt.compare(prvpassword, user.password)

    if(password){if(!checkpwd) return res.status(400).json({message:"Wrong password"})}
    
    if (!user) return res.status(400).json({message:"User Not Found"})

    const duplicate = await User.findOne({username}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message:"Duplicate username"})
    }

    if(username)user.username = username
    if(roles)user.roles = roles
    if(typeof active === "boolean")user.active = active
    if(teams)user.teams = teams
    if(skills)user.skills = skills
    if(password) user.password = await bcrypt.hash(password,10)

    const updateUser = await user.save()

    res.json({message:`${updateUser.username} updated`})
}
// DELETE 
const deleteUser = async (req,res)=>{
    const{id}=req.body
    if(!id) return res.status(400).json({message:`User ID Required`})

    const user = await User.findById(id).exec()
    if(!user) return res.status(400).json({message:`User not Found`})

    const result = await user.deleteOne()
    const reply = `Username: ${result.username} with ID : ${result._id} is deleted`
    res.json(reply)
}

module.exports = {getallUsers,createUser,updateUser,deleteUser}