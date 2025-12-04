const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14*24*60*60*100;
const Session = require('../models/Session.js');
const crypto = require('crypto');
exports.signUp = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const duplicateUser = await User.findOne({ username });
    if (duplicateUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      hashedPassword,
      displayName: `${firstName} ${lastName}`
    });

    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};
exports.signIn = async(req,res)=>{
  try{
    //get inputs
    const {username,password} = req.body;
    if(!username || !password){
      return res.status(400).json({message:'All fields are required'});
    }
    //hashed password from db vs password
    const user = await User.findOne({username});

    if(!user){
      return res.status(401).json({message:'Invalid credentials'});
    }
    //check password
    const passwordMatch = await bcrypt.compare(password,user.hashedPassword);
    if(!passwordMatch){
      return res.status(401).json({message:'Invalid credentials'});
    }
    //generate  access token with JWT
    const accessToken = jwt.sign(
      {userId:user._id},
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn:ACCESS_TOKEN_TTL}
    );
    //create refresh token
    const refreshToken = crypto.randomBytes(64).toString('hex');

    //create session which save refresh token
    await Session.create({
      userId:user._id,
      refreshToken:refreshToken,
      expiresAt:new Date(Date.now()+REFRESH_TOKEN_TTL)
    });
    //return access token and refresh token to client
    res.cookie('refreshToken',refreshToken,{
      httpOnly:true,
      secure:true,
      sameSite:'Strict',
      maxAge:REFRESH_TOKEN_TTL
    }); 
    return res.status(200).json({
      message:`User ${user.displayName} signed in successfully`,
      accessToken
    });
  }catch(err){
    return res.status(500).json({ message: err.message || 'Server error' });
  } 
}