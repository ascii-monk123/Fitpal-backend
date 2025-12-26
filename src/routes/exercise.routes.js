import {Router} from 'express';
import requireAuth from '../middlware/auth.js';
import { createExercise, getExercise, listExercises, updateExercise, deleteExercise } from '../controllers/exercise.controllers.js';

const exercise_router = Router();


//post request to create exercises
exercise_router.post('/create', requireAuth, createExercise);
//get request to get the exercises
exercise_router.get("/list",requireAuth, listExercises);
//update rquest to update users exercises
exercise_router.patch("/:id", requireAuth, updateExercise);
//delete request to delete users exercise
exercise_router.delete("/:id", requireAuth, deleteExercise);
//get a single exercise for info
exercise_router.get("/exercise/:id", requireAuth, getExercise);


export default exercise_router;
