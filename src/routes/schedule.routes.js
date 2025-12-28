import {Router} from 'express';
import requireAuth from '../middlware/auth.js';
import { createWorkoutSchedule, listSchedules, getSchedule} from '../controllers/schedule.controller.js';


const scheduleRouter = Router();

//routes

//create schedule
scheduleRouter.post("/create", requireAuth, createWorkoutSchedule);

//get list of schedules
scheduleRouter.get("/list", requireAuth, listSchedules);

//get a particular workout schedule
scheduleRouter.get("/:id", requireAuth, getSchedule);



export default scheduleRouter;