import mongoose, { mongo } from "mongoose";
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

//function to validate exercises
const validateExercise = async (data, req, res) => {
  //check whether each id exists or not
  const exIds = [
    ...new Set(
      data.exercises.map((ex) => {
        return ex.exerciseId;
      })
    ),
  ];

  //convert into ids format
  const obIds = exIds.map((id) => new mongoose.Types.ObjectId(id));

  //count how many total documents with these exercises
  const count = await Exercise.countDocuments({
    _id: { $in: obIds },
  });
  if (count != obIds.length) {
    return false;
  }
  return true;
};
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

    const validated = await validateExercise(data, req, res);
    if (!validated)
      return res
        .status(400)
        .json({ message: "One or more exercises do not exist" });

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

//function:get a list of users workouts
// GET: /api/v1/workouts/

const listWorkouts = async (req, res) => {
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
    const [workouts, total] = await Promise.all([
      Workout.find(filter).sort({ createdAt: -1 }).limit(l).lean(),
      Workout.countDocuments(filter),
    ]);

    res.status(200).json({ workouts, total, page: p, limit: l });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//update workout
const updateWorkout = async (req, res) => {
  try {
    //get the id
    const id = req.params.id;

    //validify id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    //validify the input
    const parsed = workout_schema.partial().safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input" });
    }
    const data = parsed.data;
    const validated = await validateExercise(data, req, res);
    if (!validated)
      return res
        .status(400)
        .json({ message: "One or more exercises do not exist" });
    //update
    const workout = await Workout.findOneAndUpdate(
      { _id: id, user: req.user.sub },
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!workout) return res.status(403).json({ message: "Forbidden" });

    return res.status(200).json(workout);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete workout
const deleteWorkout = async (req, res) => {
  try {
    //get id
    const id = req.params.id;

    //id verify
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    //delete the workout
    const workout = await Workout.findOneAndDelete({ _id: id, user: req.user.sub });

    if (!workout) return res.status(404).json({ message: "Workout not found" });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
export {
  createWorkout,
  getWorkout,
  listWorkouts,
  updateWorkout,
  deleteWorkout,
};
