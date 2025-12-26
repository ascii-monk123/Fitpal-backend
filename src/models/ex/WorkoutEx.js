import mongoose from "mongoose";


const workoutExSchema = mongoose.Schema({
    exerciseId: {type: mongoose.Schema.Types.ObjectId, ref: "Exercise"},
    name: {type:String, required:true, minlength:2, maxlength:80, required:true, trim:true},
    order: {type:Number, required:true, min:1},
    targetSets: {type:Number, required:true, min:1, max:50},
    targetReps: {type:Number, required:true, min:1, max:200},

    targetWeight:{type:Number, min:0}, //kgs
    restSec: {type:Number, min:0, max:3600}, //optional
    notes: {type:String, trim:true, maxlength:1000}

}, {_id:false});


export default workoutExSchema;