import mongoose from "mongoose";
import PDFDocument from 'pdfkit';
import Workout from "../models/Workout.js";
import WorkoutSchedule from "../models/WorkoutSchedule.js";
import WorkoutSession from "../models/WorkoutSession.js";;
import Exercise from "../models/Exercise.js";


const generateReport = async(req, res)=>{
    try{
        const id = req.user.sub;

        const [workouts, sessions, schedules, exercises] = await Promise.all(
            [
                Workout.find({user:id}).lean(),
                WorkoutSession.find({user:id}).lean(),
            WorkoutSchedule.find({user:id}).lean(),
            Exercise.find({createdBy :id}).lean()
            ]
        );

        //create a pdf
        const doc = new PDFDocument({margin:40, size:'A4'});

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader( "Content-Disposition",
      "attachment; filename=workout-report.pdf");

      doc.pipe(res);


      //title
      doc.fontSize(20).text("Workout Report", {align:"center"});
      doc.moveDown();
      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`);
      doc.moveDown();

      //Workouts
      doc.fontSize(16).text("Workouts");
      doc.moveDown(0.5);
      workouts.forEach((w, i) => {
      doc.fontSize(12).text(`${i + 1}. ${w.title || "Untitled workout"}`);
    });
    doc.moveDown();

    //Schedules
    doc.fontSize(16).text("Schedules");
    doc.moveDown(0.5);
    schedules.forEach((s, i) => {
      doc
        .fontSize(12)
        .text(
          `${i + 1}. ${s.title || "Schedule"} → Workout: ${s.workout}`
        );
    });
    doc.moveDown();

    // ---------- SESSIONS ----------
    doc.fontSize(16).text("Workout Sessions");
    doc.moveDown(0.5);

    sessions.forEach((s, i) => {
      doc.fontSize(12).text(
        `${i + 1}. ${new Date(s.performedAt).toLocaleDateString()} | ` +
        `Duration: ${s.durationMin || "-"} min | RPE: ${s.rpe || "-"}`
      );

      doc.moveDown(0.5);
    });

    //exercises
    doc.fontSize(16).text("Exercises");
    doc.moveDown(0.5);
    exercises.forEach((e, i) => {
      doc
        .fontSize(12)
        .text(`${i + 1}. ${e.name} (${e.muscleGroup || "N/A"})`);
    });
    doc.moveDown();

    doc.end();

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server error"});
    }
}

export {generateReport};