import mongoose from 'mongoose';

//user schema
const userSchema = new mongoose.Schema({
 username: {type:String, required:true, trim:true, minlength:3, maxlength:30, unique:true},
 email: {type:String, required:true, trim:true, unique:true, lowercase:true},
 passwordHash : {type:String, required:true}
}, {timestamps:true});

export default mongoose.model("User", userSchema);