import mongoose from "mongoose";


const workoutExSchema = mongoose.Schema({
    exerciseId: {type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required:true},
    name: {type:String, minlength:2, maxlength:80, required:true, trim:true},
    order: {type:Number, required:true, min:1, validate:Number.isInteger},
    targetSets: {type:Number, required:true, min:1, max:50,  validate: Number.isInteger},
    targetReps: {type:Number, required:true, min:1, max:200,  validate: Number.isInteger},

    targetWeight:{type:Number, min:0}, //kgs
    restSec: {type:Number, min:0, max:3600, validate:Number.isInteger}, //optional
    notes: {type:String, trim:true, maxlength:1000}

}, {_id:false});


export default workoutExSchema;