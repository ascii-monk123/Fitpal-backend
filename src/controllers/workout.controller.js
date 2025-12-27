import mongoose from "mongoose";
import { z } from "zod";
import Workout from "../models/Workout.js";

//workout zod object
const workoutExZod = z.object({
  exerciseId: z
    .string()
    .min(1)
    .regex(/^[0-9a-fA-F]{24}$/),
  name: z.string().min(2).max(80),
  order: z.number().int().min(1),
  targetSets: z.number().int().min(1).max(50),
  targetReps: z.number().int().min(1).max(200),
  targetWeight: z.number().min(0).optional(),
  restSec: z.number().int().min(0).max(3600).optional(),
  notes: z.string().max(1000).optional(),
});

const workout_schema = z.object({
  title: z.string().min(3).max(200),
  status: z.enum(["active", "archived"]).default("active"),
  exercises: z.array(workoutExZod).default([]),
});

//create a workout
const createWorkout = async (req, res) => {
  try {
    //parse the request body
    const parsed = workout_schema.safeParse(req.body);

    //if format not correct end
    if (!parsed.success)
      return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten()});

    const data = parsed.data;
    //create a new workout
    const workout = await Workout.create({ ...data, user: req.user.sub });

    //check if created or not
    if (!workout)
     return res
        .status(409)
        .json({ message: "Couldn't create resource, please try again" });

    return res.status(201).json(workout);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

export { createWorkout };
