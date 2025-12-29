import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import auth_router from './routes/auth.routes.js';
import exercise_router from './routes/exercise.routes.js';
import workout_router from './routes/workout.routes.js';
import scheduleRouter from './routes/schedule.routes.js';
import workoutSessionRouter from './routes/wsession.routes.js';
import reportRouter from './routes/report.route.js';

//setup env file
dotenv.config('.env');

const app = express();
const PORT = process.env.PORT || 8000;

//middlewares
//cors
app.use(cors());

//morgan
app.use(morgan("dev"));

//json
app.use(express.json({'limit' : '3mb'}));

//routes
app.use("/api/v1/users", auth_router);

//exercise
app.use("/api/v1/exercises", exercise_router);

//workout
app.use("/api/v1/workouts", workout_router);

//schedule
app.use("/api/v1/schedules", scheduleRouter);

//workout sessions
app.use("/api/v1/workout-sessions", workoutSessionRouter);

//report
app.use("/api/v1/users/report", reportRouter);


//connection to database and listen for requests
connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server started at port ${PORT}`);
    })
}).catch(err=>{
    console.log(`Server cannot start due to the following error ${err}`);
});
