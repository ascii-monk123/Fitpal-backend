import mongoose from 'mongoose';

const WorkoutScheduleSchema = new mongoose.Schema({
 user: {type: mongoose.Schema.Types.ObjectId, ref:"User", required:true},
 workout :{type:mongoose.Schema.Types.ObjectId, ref:"Workout", required:true},
 startAt:{type:Date, required:true},
 timezone:{type:String, default:"UTC"},
 status:{type:String, enum:["pending", "done", "skip"], default:"pending", index:true},

}, {timestamps:true});

//indexes optimized for queries
//Index documents sorted by user first, then by startAt (ascending).
WorkoutScheduleSchema.index({user:1, startAt:1});
//Index by user, then status, then startAt.
WorkoutScheduleSchema.index({user:1, status:1, startAt:1});

export default mongoose.model("WorkoutSchedule", WorkoutScheduleSchema);