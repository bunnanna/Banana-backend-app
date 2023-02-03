const Team = require("../models/Team")
const User = require("../models/User")

// GET 
const getallTeams = async(req,res)=>{
    const {filter}=req.body
    const teams = await Team.find(filter).populate("manager","_id username").populate("member","_id username").populate("project","_id projectname").lean()
    if(!teams?.length){
        return res.status(400).json({message:"Team Not Found"})
    }

    res.json(teams)
}
// CREATE 
const createTeam = async(req,res)=>{
    const{teamname,manager,member,project} = req.body
    if (!teamname,!manager){
        return res.status(400).json({message:"All Field Are Require"})
    }
    const duplicate = await Team.findOne({teamname}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate){
        return res.status(409).json({message:"Duplicate teamname"})
    }

    const teamObject = {teamname,manager,member,project}

    const team = await Team.create(teamObject)

    if(team){
        res.status(201).json({message:`New team ${teamname} created`})
    }else{
        res.status(400).json({message:`Invalid team data recived`})
    }
}
// PATCH
const updateTeam = async (req,res) =>{
    const{id,teamname,manager,member} = req.body
    if (!id){
        return res.status(400).json({message:"All Field Except Teams Are Require"})
    }

    const team = await Team.findById(id).exec()

    if (!team) return res.status(400).json({message:"Team Not Found"})

    const duplicate = await Team.findOne({teamname}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message:"Duplicate username"})
    }
    if(member){
        const added_members = member.filter(e=>!team.member.map(String).includes(e))
        const del_members = team.member.map(String).filter(e=>!member.includes(e))
        added_members.map(async user=>await User.findByIdAndUpdate(user,{$push:{"teams":team._id}}))
        del_members.map(async user=>await User.findByIdAndUpdate(user,{$pull:{"teams":team._id}}))
    }

    if(teamname) team.teamname = teamname
    if(manager) team.manager = manager
    if(member) team.member = member

    const updateTeam = await team.save()

    res.json({message:`${updateTeam.teamname} updated`})
}
// DELETE 
const deleteTeam = async (req,res)=>{
    const{id}=req.body
    if(!id) return res.status(400).json({message:`Team ID Required`})

    const team = await Team.findById(id).exec()
    if(!team) return res.status(400).json({message:`Team not Found`})

    team.member.map(async user=> await User.findByIdAndUpdate(user,{$pull:{"teams":team._id}}))
    
    const result = await team.deleteOne()
    const reply = `Teamname: ${result.teamname} with ID : ${result._id} is deleted`
    res.json(reply)
}

module.exports = {getallTeams,createTeam,updateTeam,deleteTeam}