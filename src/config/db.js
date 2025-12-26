import mongoose from 'mongoose';

const connectDB = async ()=>{
    try{
        const uri = process.env.MONGO_URI;

        if(!uri) throw new Error("Cannot connect to the database");

        //this is configuring mongoose global behavior
        mongoose.set('strictQuery', true);
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

    }catch(err){
        console.log(err);
    }
};

export default connectDB;