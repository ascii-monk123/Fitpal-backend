import mongoose from "mongoose";


const sessionExSchema  = mongoose.Schema({
    exerciseId: {type: mongoose.Schema.Types.ObjectId, ref:"Exercise"},
    order: {type:Number, min:1, required:true},
    sets:{type:Number, min:1, max:50, required:true},
    reps:{type:Number, min:1, max:200, required:true},
    weight:{type:Number, min:0},
    restSec: {type:Number, min:0, max:3600},
    notes:{type:String, trim:true, maxlength:500}
},{_id:false});


export default sessionExSchema;