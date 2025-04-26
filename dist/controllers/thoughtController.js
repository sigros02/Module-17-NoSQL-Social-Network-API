import { Thought, User } from "../models/index.js";
// GET all thoughts /thoughts
export const getAllThoughts = async (_req, res) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
/**
 * GET Thought by id /thoughts/:id
 * @param string id
 * @returns a single Thought object
 */
export const getThoughtById = async (req, res) => {
    const { thoughtId } = req.params;
    console.log("****************************************");
    console.log(thoughtId);
    try {
        const thought = await Thought.findById(thoughtId).populate("thoughtText");
        if (thought) {
            res.json({
                thought,
            });
        }
        else {
            res.status(404).json({
                message: "Thought not found",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
/**
 * POST to create new thought /thoughts
 * @param object thought
 * @returns a single Thought object
 */
export const createThought = async (req, res) => {
    try {
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log(req.body);
        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate({ _id: req.body.userId }, { $addToSet: { thoughts: thought._id } }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "No user found with that ID :(" });
        }
        res.status(200).json(thought);
        return;
    }
    catch (err) {
        res.status(500).json(err);
        return;
    }
};
/**
 * PUT Thought based on id /thoughts/:id
 * @param object id
 * @returns a single Thought object
 */
export const updateThought = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true });
        if (!thought) {
            return res.status(404).json({ message: "No thought with this id!" });
        }
        res.json(thought);
        return;
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
        return;
    }
};
/**
 * DELETE Thought based on id /thoughts/:id
 * @param string id
 * @returns string
 */
export const deleteThought = async (req, res) => {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
        if (!thought) {
            return res.status(404).json({ message: "No thought with this id!" });
        }
        // Remove the thought's _id from any user's `thoughts` array
        await User.updateMany({ thoughts: req.params.thoughtId }, { $pull: { thoughts: req.params.thoughtId } });
        res.json({ message: "Thought successfully deleted" });
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
        return;
    }
};
/**
 * POST to create a reaction stored in a single thought's reactions array
 * /thoughts/:thoughtId/reactions
 * @param object reaction
 * @returns a single Thought object
 */
export const createReaction = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: req.body } }, { runValidators: true, new: true });
        if (!thought) {
            return res.status(404).json({ message: "No thought with this id!" });
        }
        res.json(thought);
        return;
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
        return;
    }
};
/**
 * DELETE to delete a reaction stored in a single thought's reactions array
 * /thoughts/:thoughtId/reactions/reactionId
 * @param object reaction
 * @returns a single Thought object
 */
export const deleteReaction = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { runValidators: true, new: true });
        if (!thought) {
            return res.status(404).json({ message: "No thought with this id!" });
        }
        res.json(thought);
        return;
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
        return;
    }
};
