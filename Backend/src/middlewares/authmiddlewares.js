const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
exports.protectedRoute = async (req,res,next)=>{
        try{
         //get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];//Bearer token
        if(!token){
            return res.status(401).json({message:'Unauthorized'});
        }

         //verify token
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async(err,decoded)=>{
         if(err){
            return res.status(403).json({message:'Forbidden'});
         }
        //find user from db
        const user = await User.findById(decoded.userId).select('-hashedPassword');
        if(!user){
            return res.status(401).json({message:'Unauthorized'})      
        }
        
         //respond with user data
        req.user = user;
        next();
        });
        }catch(err){
            res.status(500).json({message:err.message || 'Server error' });
        }
}