import jwt from 'jsonwebtoken';


//middleware for require auth
const requireAuth = (req, res, next)=>{
    const headers = req.headers.authorization || "";
    const token = headers.startsWith("Bearer ") ? headers.slice(7) : null;

    if(!token) res.status(401).json({message:"Missing token"});

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch(err){
        return res.status(401).json({message: "Invalid/expired token"});
    }
}

export default requireAuth;