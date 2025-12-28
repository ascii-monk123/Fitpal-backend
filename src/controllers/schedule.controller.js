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

export { createWorkoutSchedule };
