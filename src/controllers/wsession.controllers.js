import mongoose from "mongoose";
import WorkoutSession from "../models/WorkoutSession.js";
import { z } from "zod";
import Workout from "../models/Workout.js";
import WorkoutSchedule from "../models/WorkoutSchedule.js";
import Exercise from "../models/Exercise.js";

//session ex
const sessionExZod = z.object({
  exerciseId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  order: z.number().int().min(1),
  sets: z.number().int().min(1).max(50),
  reps: z.number().int().min(1).max(200),
  weight: z.number().min(0).optional(),
  restSec: z.number().int().min(0).max(3600).optional(),
  notes: z.string().max(500).optional(),
});
//zod parse validation for workout session
const workoutSessionSchema = z.object({
  workout: z
    .string()
    .min(1)
    .regex(/^[0-9a-fA-F]{24}$/),
  schedule: z
    .string()
    .min(1)
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  performedAt: z.string().datetime().optional(),
  durationMin: z.number().int().min(1).max(1000).optional(),
  rpe: z.number().int().min(1).max(10).optional(),
  notes: z.string().max(1000).optional(),
  status: z.enum(["in_progress", "done"]).default("in_progress"),
  exercises: z.array(sessionExZod).default([]),
});

//function to verify if a workout exists in the database
const verifyWorkout = async (id, req, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;

  const wId = new mongoose.Types.ObjectId(id);

  //find workout in the database
  const workout = await Workout.findOne({ _id: wId, user: req.user.sub });

  if (!workout) return false;

  return true;
};

//function to verify if schedule exists in the database
const verifySchedule = async (id, req, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;

  const sId = new mongoose.Types.ObjectId(id);

  //find schedule in the database
  const schedule = await WorkoutSchedule.findOne({
    _id: sId,
    user: req.user.sub,
  });

  if (!schedule) return false;

  return true;
};

//verify exercises
const verifyExercises = async (data) => {
  //check each id exists
  const exIds = [...new Set(data.exercises.map((ex) => ex.exerciseId))];

  //verify each id
  for (const id of exIds) {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
  }

  //id to obj ids
  const objIds = exIds.map((id) => new mongoose.Types.ObjectId(id));

  //check if objids exist
  const counts = await Exercise.countDocuments({
    _id: { $in: objIds },
  });

  if (counts != objIds.length) return false;

  return true;
};

//verify same workout and schedule
const verifySchWork = async (wId, sId, req, res) => {
  const w = new mongoose.Types.ObjectId(wId);
  const sc = new mongoose.Types.ObjectId(sId);

  //get the schedule
  const schedule = await WorkoutSchedule.findOne({
    _id: sc,
    user: req.user.sub,
  });

  if(!schedule) return false;

  if (schedule.workout.equals(w)) return true;

  return false;
};
//function: create a session
//route: POST /api/v1/workout-session/create
const createWorkoutSession = async (req, res) => {
  try {
    //validate the inputs
    const parsed = workoutSessionSchema.safeParse(req.body);

    if (!parsed.success)
      return res
        .status(400)
        .json({ message: "Invalid input", errors: parsed.error.flatten() });

    const data = parsed.data;

    //verify workout exists
    const wExists = await verifyWorkout(data.workout, req, res);

    if (!wExists)
      return res
        .status(400)
        .json({ message: "Workout doesn't exist in the database" });

    //verify schedule exists
    if (data.schedule) {
      const sExists = await verifySchedule(data.schedule, req, res);
      if (!sExists)
        return res
          .status(400)
          .json({ message: "Schedule doesn't exist in the database" });

      //now verify same workout and schedule
      const sameWandS = await verifySchWork(
        data.workout,
        data.schedule,
        req,
        res
      );

      if (!sameWandS)
        return res
          .status(400)
          .json({ message: "Schedule workout and session workout mismatch!" });
    }

    //verify all exercises in the session exist
    const exExists = await verifyExercises(data);

    if (!exExists)
      return res
        .status(400)
        .json({ message: "One or more exercises don't exist in the database" });

    //create a new sesssion
    const session = await WorkoutSession.create({
      ...data,
      user: req.user.sub,
    });

    //check if created
    if (!session)
      return res
        .status(409)
        .json({ message: "Coudlnt create resource, try agagin" });

    return res.status(201).json(session);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server error" });
  }
};


//function: delete session
//request: DELETE /api/v1/workout-sessions
const deleteSession = async(req, res)=>{
   try {
       //get id
       const id = req.params.id;
   
       //id verify
       if (!id || !mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ message: "Invalid id" });
       }
   
       //delete the session
       const session = await WorkoutSession.findOneAndDelete({ _id: id, user: req.user.sub });
   
       if (!session) return res.status(404).json({ message: "Session not found" });
   
       return res.status(200).json({ ok: true });
     } catch (err) {
       console.log(err);
       return res.status(500).json({ message: "Server error" });
     }
}


//function:get a list of users sessions
// GET: /api/v1/workout-sessions/list

const listWorkoutSessions = async (req, res) => {
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

    //get the workout session and total workout sessions that match this criteria
    const [workout_s, total] = await Promise.all([
      WorkoutSession.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).lean(),
      WorkoutSession.countDocuments(filter),
    ]);

    res.status(200).json({ workout_s, total, page: p, limit: l });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//function: get a workout session by id
//route: GET /api/v1/workout-sessions/:id
const getWorkoutSession = async (req, res) => {
  try {
    //get the id
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    //get the workout
    const workout = await WorkoutSession.findOne({ _id: id, user: req.user.sub });

    if (!workout) {
      return res.status(404).json({ message: "Workout Session not found" });
    }

    return res.status(200).json(workout);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export { createWorkoutSession, deleteSession,listWorkoutSessions, getWorkoutSession};
