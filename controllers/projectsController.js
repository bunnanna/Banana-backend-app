const Project = require("../models/Project")
const Task = require("../models/Task")
const Team = require("../models/Team")

// GET 
const getallProjects = async(req,res)=>{
    let filter = JSON.parse(req.params.filter)
    if (typeof filter != "object") filter = null
    const projects = await Project.find(filter).populate("tasks","_id taskname complete").populate("teams","_id teamname").populate("manager","_id username").lean()

    res.json(projects)
}
// CREATE 
const createProject = async(req,res)=>{
    const{projectname,manager,teams} = req.body
    if (!projectname,!manager){
        return res.status(400).json({message:"All Field Are Require"})
    }
    const duplicate = await Project.findOne({projectname}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate){
        return res.status(409).json({message:"Duplicate projectname"})
    }

    const projectObject = {projectname,manager,teams}

    const project = await Project.create(projectObject)

    teams.map(async team =>await Team.findByIdAndUpdate(team,{$push:{"project":project._id}})) 

    if(project){
        res.status(201).json({message:`New project ${projectname} created`})
    }else{
        res.status(400).json({message:`Invalid project data recived`})
    }
}
// PATCH
const updateProject = async (req,res) =>{
    const{id,projectname,manager,tasks,teams,complete} = req.body
    if (!id){
        return res.status(400).json({message:"All Field Except Teams Are Require"})
    }

    const project = await Project.findById(id).exec()

    if (!project) return res.status(400).json({message:"Project Not Found"})

    const duplicate = await Project.findOne({projectname}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message:"Duplicate username"})
    }
    if(teams){
        const added_teams = teams.filter(e=>!project.teams.map(String).includes(e))
        const del_teams = project.teams.map(String).filter(e=>!teams.includes(e))
        added_teams.map(async team=>await Team.findByIdAndUpdate(team,{$push:{"project":project._id}}))
        del_teams.map(async team=>await Team.findByIdAndUpdate(team,{$pull:{"project":project._id}}))
    }
    if(projectname)project.projectname = projectname
    if(manager)project.manager=manager
    if(tasks)project.tasks = tasks
    if(teams)project.teams = teams
    if(typeof complete === "boolean")project.complete = complete

    
    const updateProject = await project.save()

    res.json({message:`${updateProject.projectname} updated`})
}
// DELETE 
const deleteProject = async (req,res)=>{
    const{id}=req.body
    if(!id) return res.status(400).json({message:`Project ID Required`})

    const project = await Project.findById(id).exec()
    if(!project) return res.status(400).json({message:`Project not Found`})

    project.teams.map(async team=>await Team.findByIdAndUpdate(team,{$pull:{"project":project._id}}))
    const result = await project.deleteOne()
    const reply = `Projectname: ${result.projectname} with ID : ${result._id} is deleted`
    res.json(reply)
}

module.exports = {getallProjects,createProject,updateProject,deleteProject}