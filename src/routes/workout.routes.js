import {Router} from 'express';
import requireAuth from '../middlware/auth.js';
import { createWorkout, getWorkout, listWorkouts} from '../controllers/workout.controller.js';

//create the workout router
const workout_router = Router();


//create workout request
workout_router.post("/create", requireAuth, createWorkout);

//list workouts
workout_router.get("/", requireAuth, listWorkouts);

//update workout
workout_router.patch("/:id", requireAuth, ()=>{});

//get workout from id
workout_router.get("/:id", requireAuth, getWorkout);

//delete workout
workout_router.delete("/:id", requireAuth, ()=>{});

export default workout_router;