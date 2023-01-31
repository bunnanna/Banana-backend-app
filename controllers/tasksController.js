const Task = require("../models/Task")
const Project = require("../models/Project")

// GET 
const getallTasks = async(req,res)=>{
    const {filter} = req.body
    const tasks = await Task.find(filter).populate("project").populate("teams").populate("skills").populate("activity.username").lean()
    if(!tasks?.length){
        return res.status(400).json({message:"Task Not Found"})
    }
    // const ReadableTask = await Promise.all(tasks.map(async(task)=>{
    //     const projects = task.project.projectname
    //     const teams = await Promise.all(task.teams.map(async(team)=>{
    //         return team.teamname
    //     }))
    //     const skills = await Promise.all(task.skills.map(async(skill)=>{
    //         return skill.skillname
    //     }))

    //     return {...task,projects,teams,skills}
    // }))
    res.json(tasks)
}
// CREATE 
const createTask = async(req,res)=>{
    const{project,taskname,teams,skills,description,checklists} = req.body
    if (!taskname||!project||!teams?.length||!Array.isArray(teams)||!Array.isArray(skills)||!Array.isArray(checklists)){
        return res.status(400).json({message:"All Field Are Require"})
    }
    const duplicate = await Task.findOne({project,taskname}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate){
        return res.status(409).json({message:"Duplicate taskname in project"})
    }

    const taskObject = {project,taskname,teams,skills,description,checklists}

    const task = await Task.create(taskObject)
    await Project.findByIdAndUpdate(project,{$push:{"tasks":task._id}})
    
    if(task){
        res.status(201).json({message:`New task ${taskname} in Project ${project} created`})
    }else{
        res.status(400).json({message:`Invalid task data recived`})
    }
}
// PATCH
const updateTask = async (req,res) =>{
    const{id,project,taskname,teams,skills,description,checklists,complete,status,activity} = req.body
    if (!id||!project||!taskname||!Array.isArray(teams)||!Array.isArray(skills)||!Array.isArray(checklists)||!activity){
        return res.status(400).json({message:"All * Field Are Require"})
    }
    if (checklists?.length>0) {
        if (!checklists.every(o=>typeof o.check ==="boolean" && typeof o.subtask ==="string")){
            return res.status(400).json({message:"Invalid Checklists"})
        }

    }
    const task = await Task.findById(id).exec()

    if (!task) return res.status(400).json({message:"Task Not Found"})

    const duplicate = await Task.findOne({project,taskname}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message:"Duplicate username"})
     }

    task.project=project
    task.taskname=taskname
    task.teams=teams
    task.skills=skills
    task.description=description
    task.checklists=checklists
    if(typeof complete === "boolean") task.complete=complete
    if(status) task.status=status
    task.activity=[...task.activity,activity]
    
    const updateTask = await task.save()
    res.json({message:`${updateTask.taskname}in Project ${updateTask.project} updated`})
}

// PATCH
const updatecheckTask = async (req,res) =>{
    const{id,checklists} = req.body
    if (!id||!Array.isArray(checklists)){
        return res.status(400).json({message:"All * Field Are Require"})
    }
    if (checklists?.length>0) {
        if (!checklists.every(o=>typeof o.check ==="boolean" && typeof o.subtask ==="string")){
            return res.status(400).json({message:"Invalid Checklists"})
        }

    }
    const task = await Task.findById(id).exec()

    if (!task) return res.status(400).json({message:"Task Not Found"})
    console.log(checklists);
    task.checklists=checklists

    const updateTask = await task.save()
    res.json({message:`${updateTask.taskname}in Project ${updateTask.project} updated`})
}


// DELETE 
const deleteTask = async (req,res)=>{
    const{id}=req.body
    if(!id) return res.status(400).json({message:`Task ID Required`})

    const task = await Task.findById(id).exec()
    if(!task) return res.status(400).json({message:`Task not Found`})

    const result = await task.deleteOne()
    const reply = `Taskname: ${result.taskname} with ID : ${result._id} is deleted`
    res.json(reply)
}

module.exports = {getallTasks,createTask,updateTask,deleteTask,updatecheckTask}