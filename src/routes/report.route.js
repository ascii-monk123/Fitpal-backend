import { Router } from "express";
import { generateReport } from "../controllers/report.controllers.js";
import requireAuth from "../middlware/auth.js";
const reportRouter = Router();

reportRouter.get("/", requireAuth, generateReport);

export default reportRouter;