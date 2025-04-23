import db from "../config/connection.js";
import { User, Thought } from "../models/index.js";
import cleanDB from "./cleanDB.js";
import { usernames, emails, thoughts } from "./data.js";
try {
    await db();
    await cleanDB();
    // Create empty array to hold the users
    const users = [];
    // Loop 10 times -- add users to the users array
    for (let i = 0; i < 10; i++) {
        const username = usernames[i];
        const email = emails[i];
        users.push({
            username,
            email,
        });
    }
    // Add users to the collection and await the results
    const userData = await User.create(users);
    await Thought.create(thoughts);
    // update collection to add friends
    for (let i = 0; i < userData.length; i++) {
        const friendId = userData[Math.floor(Math.random() * userData.length)]._id;
        await User.findByIdAndUpdate({ _id: userData[i]._id }, { $addToSet: { friends: friendId } }, { new: true });
        console.log(`Added friend ${friendId} to user ${userData[i]._id}`);
    }
    // Log out the seed data to indicate what should appear in the database
    console.table(users);
    console.table(thoughts);
    console.info("Seeding complete! 🌱");
    process.exit(0);
}
catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
}
