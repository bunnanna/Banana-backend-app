const Role = require("../models/Role")

// GET 
const getallRoles = async(req,res)=>{
    const filter = JSON.parse(req.params.filter)
    if (typeof filter != "object") filter = null
    const roles = await Role.find().lean()
    res.json(roles)
}
// CREATE 
const createRole = async(req,res)=>{
    if (!rolename){
        return res.status(400).json({message:"All Field Are Require"})
    }
    const duplicate = await Role.findOne({rolename}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate){
        return res.status(409).json({message:"Duplicate rolename"})
    }

    const roleObject = {rolename}

    const role = await Role.create(roleObject)

    if(role){
        res.status(201).json({message:`New role ${rolename} created`})
    }else{
        res.status(400).json({message:`Invalid role data recived`})
    }
}
// PATCH
const updateRole = async (req,res) =>{
    const{id,rolename} = req.body
    if (!id||!rolename){
        return res.status(400).json({message:"All Field Except Teams Are Require"})
    }

    const role = await Role.findById(id).exec()

    if (!role) return res.status(400).json({message:"Role Not Found"})

    const duplicate = await Role.findOne({rolename}).collation({locale:"en",strength:2}).collation({locale:"ja",strength:2}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message:"Duplicate username"})
    }

    role.rolename = rolename

    const updateRole = await role.save()

    res.json({message:`${updateRole.rolename} updated`})
}
// DELETE 
const deleteRole = async (req,res)=>{
    const{id}=req.body
    if(!id) return res.status(400).json({message:`Role ID Required`})

    const role = await Role.findById(id).exec()
    if(!role) return res.status(400).json({message:`Role not Found`})

    const result = await role.deleteOne()
    const reply = `Rolename: ${result.rolename} with ID : ${result._id} is deleted`
    res.json(reply)
}

module.exports = {getallRoles,createRole,updateRole,deleteRole}