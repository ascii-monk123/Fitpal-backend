import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
     user: {type: mongoose.Schema.Types.ObjectId, ref:"User", required:true},
     workout :{type:mongoose.Schema.Types.ObjectId, ref:"Workout", required:true},
     text: {type:String,minlength:1, maxlength:1000, required:true, trim:true}
}, {timestamps:true});

//indexing new comment first
CommentSchema.index({ workout: 1, createdAt: -1 });

export default mongoose.model("Comment", CommentSchema);