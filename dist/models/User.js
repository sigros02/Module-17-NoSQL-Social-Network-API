import { Schema, model } from "mongoose";
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        max_length: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email address",
        ],
        max_length: 50,
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of ObjectIds referencing User
    // thoughts: [thoughtSchema],
}, {
    toJSON: {
        getters: true,
    },
    timestamps: true,
});
userSchema.virtual("friendCount").get(function () {
    return this.friends.length;
});
const User = model("User", userSchema);
export default User;
