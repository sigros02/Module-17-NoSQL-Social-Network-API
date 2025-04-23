import { Router } from "express";
const router = Router();
import { getAllThoughts } from "../../controllers/thoughtController.js";

// /api/thoughts
router.route("/").get(getAllThoughts);

export { router as thoughtRouter };
