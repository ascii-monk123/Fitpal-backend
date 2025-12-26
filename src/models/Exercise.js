import mongoose from "mongoose";

const exerciseSchema = mongoose.Schema({
    name:{type:String, unique:true, minlength:3, maxlength:50, required:true, trim:true, lowercase:true},
    muscleGroup:{type:String, minlength:1, maxlength:30, trim:true},
    createdBy : {type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    
},{timestamps:true});

export default mongoose.model("Exercise", exerciseSchema);