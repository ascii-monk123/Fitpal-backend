import mongoose from "mongoose";
import WorkoutSchedule from "../models/WorkoutSchedule.js";
import Workout from "../models/Workout.js";
import { z } from "zod";

//workoutschedule schema
const workoutScheduleSchema = z.object({
  workout: z
    .string()
    .min(1)
    .regex(/^[0-9a-fA-F]{24}$/),
  startAt: z.string().datetime(),
  timezone: z.string().min(1).default("UTC"), // e.g. "America/Toronto"
  status: z.enum(["pending", "done", "skip"]).default("pending"),
});

//check workout validity
const validWorkout = async (workoutId, req, res) => {
const id = new mongoose.Types.ObjectId(workoutId);
  //find workout
  const workout = await Workout.findOne({ _id: id, user: req.user.sub });

  if (!workout) return false;

  return true;
};
//function: create workout schedule
//url: POST /api/v1/schedules/create

const createWorkoutSchedule = async (req, res) => {
  try {
    //check input validity
    const parsed = workoutScheduleSchema.safeParse(req.body);

    if (!parsed.success)
      return res.status(400).json({ message: "Invalid input" });

    //find workout valid
    const data = parsed.data;
    const id = data.workout;

    const valid = await validWorkout(id, req, res);

    if (!valid)
      return res.status(400).json({ message: "Enter a valid workout" });

    //create workout schedule
    const schedule = await WorkoutSchedule.create({ ...data, user: req.user.sub });

    //error message in case no schedule is created
    if (!schedule)
      return res
        .status(409)
        .json({ message: "Couldnt create resource, please try again" });

    return res.status(201).json(schedule);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//function: to get list of workout schedules for a user
//route: GET /api/v1/schedules/list
const listSchedules = async (req, res) => {
  try {
    //first get the query params
    const { q, page = "1", limit = "10" } = req.query;

    //filter object
    const filter = new Object();

    if (q) filter.title = new RegExp(q, "i");

    filter.user = req.user.sub;

    //how many to skip
    const p = Math.max(parseInt(page, 10), 1);
    const l = Math.min(Math.max(parseInt(limit, 10), 1), 50);
    const skip = (p - 1) * l;

    //get the workouts and total workouts that match this criteria
    const [schedules, total] = await Promise.all([
      WorkoutSchedule.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).lean(),
      WorkoutSchedule.countDocuments(filter),
    ]);

    res.status(200).json({ schedules, total, page: p, limit: l });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//function: to get a workout schedule for a user
//route: GET /api/v1/schedules/:id
const getSchedule = async (req, res) => {
   try {
     //get the id
     const id = req.params.id;
 
     if (!mongoose.Types.ObjectId.isValid(id)) {
       return res.status(400).json({ message: "Invalid id" });
     }
 
     //get the schedule
     const schedule = await WorkoutSchedule.findOne({ _id: id, user: req.user.sub });
 
     if (!schedule) {
       return res.status(404).json({ message: "Schedule not found" });
     }
 
     return res.status(200).json(schedule);
   } catch (err) {
     console.log(err);
     return res.status(500).json({ message: "Server error" });
   }
};


export { createWorkoutSchedule,listSchedules, getSchedule};


//crgard thesis done commitee member on vacation sof froms masla hai main phase 1 main defense dena chahta hu.