import mongoose from 'mongoose';
import workoutExSchema from './ex/WorkoutEx.js';

//workout schema
const workoutSchema = new mongoose.Schema({
title:{type:String, required:true, trim:true, minlength:3, maxlength:200},
status:{type:String, enum:["active", "archived"], default:"active", index:true},
exercises: {type:[workoutExSchema], default:[]},
user: {type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
}, {timestamps:true});


//indexing
workoutSchema.index({user:1, status:1});

export default workoutSchema;