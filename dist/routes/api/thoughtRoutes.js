import { Router } from "express";
const router = Router();
import { getAllThoughts, getThoughtById, createThought, } from "../../controllers/thoughtController.js";
// /api/thoughts
router.route("/").get(getAllThoughts).post(createThought);
// /api/thoughts/:thoughtId
router.route("/:thoughtId").get(getThoughtById);
export { router as thoughtRouter };
