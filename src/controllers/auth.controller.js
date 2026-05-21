const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


async function userRegister(req,res) {
    const {username,email,password,role="user"} = req.body;
    const isUserAlreadyExists = await userModel.findOne({
        $or:[
         {username},
         {email}
        ]
    })
if(isUserAlreadyExists)
    return res.status(409).json({message:"User already exists"})

    try{
        
        const hash = await bcrypt.hash(password,11)

        const user = await userModel.create({
            username:username,
            email:email,
            password:hash,
            role:role
        })

        const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET)
        
        res.cookie("token",token)

        res.status(201).json({
            message:"User registered successfully",
            details:user
        })

    }
    catch(err)
    {
        res.status(403).json({
            message:"Registration failed Error: ",err
        })
    }

}


async function loginUser(req,res) {
    const {username,email,password} = req.body;

    const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    }).select("+password");
    if(!user)
        return res.status(401).json({message:"Invalid credentials"})

    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid)
        return res.status(401).json({message:"Invalid credentials"})

    
    const token  =  await jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET)
    res.cookie("token",token)

    res.status(200).json({message:"Logged in successfully",details:user})
}


async function logoutUser(req,res) {
    res.clearCookie("token")
    res.status(200).json({message:"Logged out successfully"})
}

module.exports = {
    userRegister,
    loginUser,
    logoutUser
}