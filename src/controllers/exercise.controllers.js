import Exercise from "../models/Exercise.js";
import { z } from "zod";
import mongoose from "mongoose";

//schema for posting exercise
const postExerciseSchema = z.object({
  name: z.string().min(3).max(50),
  muscleGroup: z.string().min(1).max(30),
});

//schema for fetching exercises

//function: create exercise
//request: POST /api/v1/exercises/create

const createExercise = async (req, res) => {
  //verify the inputs
  const parsed = postExerciseSchema.safeParse(req.body);

  if (!parsed.success)
    return res
      .status(400)
      .json({ message: "Invalid inputs", errors: parsed.error.flatten() });

  //parsed data
  const data = parsed.data;
  const name = data.name;
  //check if exercise exists
  const exists = await Exercise.findOne({ name });

  if (exists)
    return res
      .status(409)
      .json({ message: "Exercise with this name already exists" });

  try {
    //create new exercise
    const exercise = await Exercise.create({
      ...data,
      createdBy: req.user.sub,
    });

    return res.status(201).json(exercise);
  } catch (err) {
    return res.status(500).json({
      message: "Server couldnt complete the request, please try again",
    });
  }
};

//function: list exercises
//request: GET /api/v1/exercises/list?params

const listExercises = async (req, res) => {
  //get the url params
  const { q, page = "1", limit = "10" } = req.query;

  //get the workouts based on filter or most recent first
  const filter = new Object();
  if (q) filter.name = new RegExp(q, "i");

  //implement pagination, since its zero indexed
  const p = Math.max(parseInt(page, 10), 1); //makes sure the page number is atleast 1
  const l = Math.min(Math.max(parseInt(limit, 10), 1), 50); //set the limit to max 50

  //how many documents to skip
  const skip = (p - 1) * l;

  //get all the documents from the database and how many total such documents are present
  const [items, count] = await Promise.all([
    Exercise.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).lean(),
    Exercise.countDocuments(filter),
  ]);

  res.status(200).json({ items, count, page: p, limit: l });
};

//function:  getExercise by id
// request: GET /api/exercises/exercise/:id

const getExercise = async (req, res) => {
  try {
    //get the id
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id is invalid" });
    }
    //find if the id is in the server
    const exercise = await Exercise.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    //check for no exercise or id together
    if (!exercise)
      return res.status(400).json({ message: "exercise wasn't found" });

    //return the found exercise
    return res.json(exercise);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server couldn't complete the request, please try again",
    });
  }
};

//function: update Exercise
//route: PATCH /api/v1/exercises/:id

const updateExercise = async (req, res) => {
  try {
    //get the id
    const id = req.params.id;

    //verify the input
    const parsed = postExerciseSchema.partial().safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "invalid input" });
    }

    //check type of id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id not valid" });
    }

    //get the post from the database
    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res
        .status(404)
        .json({ message: "The exercise user wants to update doesn't exist" });
    }


    //update the exercise
    const updatedExercise = await Exercise.findOneAndUpdate({_id:id, createdBy:req.user.sub}, parsed.data, {
      new: true, runValidators: true
    });

    if (!updatedExercise) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(updatedExercise);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server couldn't update the exercise, please try again",
    });
  }
};


//function: delete Exercise
//route: DELETE /api/v1/exercises/:id

const deleteExercise = async(req, res)=>{

    //get the id and verify
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message: "invalid id"});
    }

    //delete the exercise
    const exercise = await Exercise.findOneAndDelete({_id:id, createdBy:req.user.sub});

    if(!exercise){
        return res.status(404).json({message: 'Cannot find post or forbidden'});
    }
    
    return res.json({ok:true});
}
export { createExercise, getExercise, listExercises, updateExercise, deleteExercise };
