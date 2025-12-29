import { Router } from "express";
import requireAuth from "../middlware/auth.js";
import { createWorkoutSession, deleteSession, listWorkoutSessions } from "../controllers/wsession.controllers.js";

const workoutSessionRouter = Router();


//specify the routes

//add a workout session
workoutSessionRouter.post("/create", requireAuth, createWorkoutSession);

//update a workout session
workoutSessionRouter.patch("/:id",requireAuth,()=>{});

//delete a workout session
workoutSessionRouter.delete("/:id", requireAuth, deleteSession);

//get all workout sessions
workoutSessionRouter.get("/list", requireAuth, listWorkoutSessions);

//get a particular workout session by id
workoutSessionRouter.get("/:id", requireAuth, ()=>{});


export default workoutSessionRouter;