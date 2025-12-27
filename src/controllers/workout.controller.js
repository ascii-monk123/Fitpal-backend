import mongoose from "mongoose";
import { z } from "zod";
import Workout from "../models/Workout.js";
import Exercise from "../models/Exercise.js";

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

//function: create a workout
//route: POST /api/v1/workouts/create
const createWorkout = async (req, res) => {
  try {
    //parse the request body
    const parsed = workout_schema.safeParse(req.body);

    //if format not correct end
    if (!parsed.success)
      return res
        .status(400)
        .json({ message: "Invalid input", errors: parsed.error.flatten() });

    const data = parsed.data;

    //check whether each id exists or not
    const exIds = [
      ...new Set(data.exercises.map(ex=>{
        return ex._id;
      }))
    ];
    //convert into ids format
    const obIds = exIds.map(id=>new mongoose.Types.ObjectId(id));

    //count how many total documents with these exercises
    const count = await Exercise.countDocuments({
      _id: {$in:obIds}
    });

    if(count != obIds.length){
      return res.status(400).json({message: 'One or more exercises do not exist'});
    }
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

//function: get a workout by id
//route: GET /api/v1/workouts/:id
const getWorkout = async (req, res) => {
  try {
    //get the id
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    //get the workout
    const workout = await Workout.findOne({ _id: id, user: req.user.sub });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    return res.status(200).json(workout);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
export { createWorkout, getWorkout };
