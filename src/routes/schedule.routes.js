import {Router} from 'express';
import requireAuth from '../middlware/auth.js';
import { createWorkoutSchedule } from '../controllers/schedule.controller.js';


const scheduleRouter = Router();

//routes

//create schedule
scheduleRouter.post("/create", requireAuth, createWorkoutSchedule)



export default scheduleRouter;