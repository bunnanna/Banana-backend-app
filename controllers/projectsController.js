const Project = require("../models/Project")

// GET 
const getallProjects = async(req,res)=>{
    const projects = await Project.find().lean()
    if(!projects?.length){
        return res.status(400).json({message:"Project Not Found"})
    }

    res.json(projects)
}
// CREATE 
const createProject = async(req,res)=>{
    const{projectname,manager,tasks,teams} = req.body
    if (!projectname,!manager){
        return res.status(400).json({message:"All Field Are Require"})
    }
    const duplicate = await Project.findOne({projectname}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate){
        return res.status(409).json({message:"Duplicate projectname"})
    }

    const projectObject = {projectname,manager,tasks,teams}

    const project = await Project.create(projectObject)

    if(project){
        res.status(201).json({message:`New project ${projectname} created`})
    }else{
        res.status(400).json({message:`Invalid project data recived`})
    }
}
// PATCH
const updateProject = async (req,res) =>{
    const{id,projectname,manager,tasks,teams,complete} = req.body
    if (!id||!projectname||!manager){
        return res.status(400).json({message:"All Field Except Teams Are Require"})
    }

    const project = await Project.findById(id).exec()

    if (!project) return res.status(400).json({message:"Project Not Found"})

    const duplicate = await Project.findOne({projectname}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message:"Duplicate username"})
    }

    project.projectname = projectname
    project.manager=manager
    project.tasks = tasks
    project.teams = teams
    project.complete = complete

    const updateProject = await project.save()

    res.json({message:`${updateProject.projectname} updated`})
}
// DELETE 
const deleteProject = async (req,res)=>{
    const{id}=req.body
    if(!id) return res.status(400).json({message:`Project ID Required`})

    const project = await Project.findById(id).exec()
    if(!project) return res.status(400).json({message:`Project not Found`})

    const result = await project.deleteOne()
    const reply = `Projectname: ${result.projectname} with ID : ${result._id} is deleted`
    res.json(reply)
}

module.exports = {getallProjects,createProject,updateProject,deleteProject}