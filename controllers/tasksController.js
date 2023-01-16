const Task = require("../models/Task")

// GET 
const getallTasks = async(req,res)=>{
    const tasks = await Task.find().select().lean()
    if(!tasks?.length){
        return res.status(400).json({message:"Task Not Found"})
    }
    res.json(tasks)
}
// CREATE 
const createTask = async(req,res)=>{
    const{projectname,taskname,teams,skills,description,checklist,complete} = req.body
    if (!taskname||!projectname||!teams?.length||!Array.isArray(teams)||!Array.isArray(skills)||!Array.isArray(checklist)){
        return res.status(400).json({message:"All Field Are Require"})
    }
    const duplicate = await Task.findOne({projectname,taskname}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate){
        return res.status(409).json({message:"Duplicate taskname in project"})
    }

    const taskObject = {projectname,taskname,teams,skills,description,checklist,complete}

    const task = await Task.create(taskObject)

    if(task){
        res.status(201).json({message:`New task ${taskname} in Project ${projectname} created`})
    }else{
        res.status(400).json({message:`Invalid task data recived`})
    }
}
// PATCH
const updateTask = async (req,res) =>{
    const{id,projectname,taskname,teams,skills,description,checklist,complete} = req.body
    if (!id||!projectname||!taskname||!teams?.length||!Array.isArray(teams)||!Array.isArray(skills)||!Array.isArray(checklist)||typeof complete !== "boolean"){
        return res.status(400).json({message:"All * Field Are Require"})
    }
    if (checklist?.length>0) {
        if (!checklist.every(o=>typeof o.check ==="boolean" && typeof o.subtask ==="string")){
            return res.status(400).json({message:"Invalid Checklist"})
        }

    }
    const task = await Task.findById(id).exec()

    if (!task) return res.status(400).json({message:"Task Not Found"})

    const duplicate = await Task.findOne({projectname,taskname}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message:"Duplicate username"})
     }
    task.projectname=projectname
    task.taskname=taskname
    task.teams=teams
    task.skills=skills
    task.description=description
    task.checklist=checklist
    task.complete=complete
    

    const updateTask = await task.save()

    res.json({message:`${updateTask.taskname}in Project ${updateTask.projectname} updated`})
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

module.exports = {getallTasks,createTask,updateTask,deleteTask}