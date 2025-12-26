import bcrypt from 'bcrypt';
import {z} from 'zod';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


//register schema verification check
const registerSchema = z.object({
    username:z.string().min(3).max(30),
    email:z.string().email(),
    password:z.string().min(6).max(100)
});

//login schema
const loginSchema = z.object({
    email:z.string().email(),
    password:z.string().min(1)
});

//jwt token
const signToken = (user)=>{
    return jwt.sign({
        sub:user._id.toString()}, 
        process.env.JWT_SECRET, 
        {expiresIn:process.env.JWT_EXPIRES_IN || "7d"});
};


//register
const register = async (req, res)=>{
const parsed = registerSchema.safeParse(req.body);
//invalid input
//The 400 status code is an HTTP response that means the server cannot or will not process the request because something about it is a client error
if(!parsed.success) return res.status(400).json({message:"Invalid input", errors:parsed.error.flatten()});

const {username, email, password} = parsed.data;

//check if username or email already exits
//The 409 Conflict HTTP status code indicates that the request could not be completed because it conflicts with the current state of the target resource
const exists = await User.findOne({$or:[{email}, {username}]});
if(exists) return res.status(409).json({message:'Username or email already exists'});

//hash
const passwordHash = await bcrypt.hash(password, 10);

//create user
const user = await User.create({username, email, passwordHash});


//sign token for auth
const token = signToken(user);
//The HTTP 201 Created status code indicates that the request has been successfully fulfilled and has resulted in one or more new resources being created on the server
res.status(201).json({token, user:{id: user._id, email:user.email, username:user.username}});



};


//login
const login = async(req, res)=>{
    //get the parsed details
    const parsed = loginSchema.safeParse(req.body);

    if(!parsed.success) return res.status(400).json({message:"Invalid credentials"});

    //fetch email and password
    const {email, password} = parsed.data;
    
    //check email exists
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({messageL:"User not registered"});

    //verify the password
    const password_verify = bcrypt.compare(password, user.passwordHash);

    if(!password_verify) return res.status(400).json({message:"Password Incorrect"});

    //get the token
    const token = signToken(user);

    res.json({token,user:{id:user._id, email:user.email, username:user.username}});


};

export {login, register};


