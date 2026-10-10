const Router = require("express");
const { tokenVerifyMiddleware } = require("../middlewares/middlewares");
const User = require("../models/User");


const router = Router();

router.post('/create-user',tokenVerifyMiddleware,async(req,res)=>{
    if(req.user.role !== 'admin'){
        return res.status(403).json({message:"Authorization Access Denied"})
    }
    const {name,email,password,role,team} = req.body;
    if(!name || !email || !password || !role || !team){
        return res.status(401).json({message:"All Fields Are Required!"})
    }
    const isEmailUsed = await User.findOne({email});
    if(isEmailUsed){
        return res.status(401).json({message:"Email Already Used!"})
    }
    const user = User.create({
        name,
        email,
        password,
        role,
        team
    })
    return res.status(201).json({message:"User Created Successfully!",user});
})

module.exports = router;