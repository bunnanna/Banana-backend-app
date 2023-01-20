const Skill = require("../models/Skill")

// GET 
const getallSkills = async(req,res)=>{
    const skills = await Skill.find().lean()
    if(!skills?.length){
        return res.status(400).json({message:"Skill Not Found"})
    }

    res.json(skills)
}
// CREATE 
const createSkill = async(req,res)=>{
    const{skillname} = req.body
    if (!skillname){
        return res.status(400).json({message:"All Field Are Require"})
    }
    const duplicate = await Skill.findOne({skillname}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate){
        return res.status(409).json({message:"Duplicate skillname"})
    }

    const skillObject = {skillname}

    const skill = await Skill.create(skillObject)

    if(skill){
        res.status(201).json({message:`New skill ${skillname} created`})
    }else{
        res.status(400).json({message:`Invalid skill data recived`})
    }
}
// PATCH
const updateSkill = async (req,res) =>{
    const{id,skillname} = req.body
    if (!id||!skillname){
        return res.status(400).json({message:"All Field Except Teams Are Require"})
    }

    const skill = await Skill.findById(id).exec()

    if (!skill) return res.status(400).json({message:"Skill Not Found"})

    const duplicate = await Skill.findOne({skillname}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message:"Duplicate username"})
    }

    skill.skillname = skillname

    const updateSkill = await skill.save()

    res.json({message:`${updateSkill.skillname} updated`})
}
// DELETE 
const deleteSkill = async (req,res)=>{
    const{id}=req.body
    if(!id) return res.status(400).json({message:`Skill ID Required`})

    const skill = await Skill.findById(id).exec()
    if(!skill) return res.status(400).json({message:`Skill not Found`})

    const result = await skill.deleteOne()
    const reply = `Skillname: ${result.skillname} with ID : ${result._id} is deleted`
    res.json(reply)
}

module.exports = {getallSkills,createSkill,updateSkill,deleteSkill}