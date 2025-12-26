import mongoose from "mongoose";
import sessionExSchema from "./ex/SessionEx.js";
//schema for workout session
const WorkoutSessionSchema = new mongoose.Schema({
 user: {type: mongoose.Schema.Types.ObjectId, ref:"User", required:true},
 workout :{type:mongoose.Schema.Types.ObjectId, ref:"Workout", required:true},
 schedule:{type:mongoose.Schema.Types.ObjectId, ref:"WorkoutSchedule"},
 performedAt:{type:Date, required:true, default:Date.now},
 exercises:{type:[sessionExSchema], default:[]},
 durationMin: {type: Number,min: 1,  max: 1000}, // ~16 hours cap, just safety,
 rpe: {type:Number, min:1, max:10}, //rate of perceived exertion from 1 to 10
 notes: {type:String, trim:true, maxlength:1000},
 status: { type: String, enum: ["in_progress", "done"], default: "in_progress" }


},{timestamps:true});


//indexes
WorkoutSessionSchema.index({ user: 1, performedAt: -1 });
WorkoutSessionSchema.index({ schedule: 1 });
WorkoutSessionSchema.index({ user: 1, status: 1, performedAt: -1 });



export default mongoose.model("WorkoutSession", WorkoutSessionSchema);