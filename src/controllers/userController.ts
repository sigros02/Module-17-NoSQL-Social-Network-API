// ObjectId() method for converting Id string into an ObjectId for querying database
import { Request, Response } from "express";
import { User, Thought } from "../models/index.js";

// GET all users /users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET User by id /users/:id
 * @param string id
 * @returns a single User object
 */
export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  console.log("****************************************");
  console.log(userId);
  try {
    const user = await User.findById(userId).populate("username");
    if (user) {
      res.json({
        user,
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * POST to create new user /users
 * @param object user
 * @returns a single User object
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * PUT User based on id /users/:id
 * @param object id
 * @returns a single User object
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!user) {
      res.status(404).json({ message: "No user with this id!" });
    }

    res.json(user);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * DELETE User based on id /users/:id
 * @param string id
 * @returns string
 */

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.userId,
    });

    if (!user) {
      return res.status(404).json({ message: "No such user exists" });
    }

    const thought = await Thought.deleteMany({ username: user.username });

    if (!thought) {
      return res.status(404).json({
        message: "User deleted, but no thoughts found",
      });
    }

    return res.json({ message: "User successfully deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

/**
 * POST Friend based on /users/:userId/friends
 * @param string id
 * @param object friend
 * @returns object user
 */

export const addFriend = async (req: Request, res: Response) => {
  console.log("You are adding a friend");
  console.log(req.body);
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.body } },
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user found with that ID :(" });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

/**
 * DELETE Friend based on /users/:userID/friends
 * @param string friendId
 * @param string userId
 * @returns object user
 */

export const removeFriend = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user found with that ID :(" });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};
