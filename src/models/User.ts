import { Schema, model, type Document } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  friends: Schema.Types.ObjectId[]; // Array of ObjectIds
  thoughts: Schema.Types.ObjectId[]; // Array of ObjectIds
}

const userSchema = new Schema<IUser>(
  {
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
    thoughts: [{type: Schema.Types.ObjectId, ref: "Thought"}], // Array of ObjectIds referencing Thought
  },
  {
    toJSON: {
      getters: true,
    },
    timestamps: true,
  }
);

userSchema.virtual("friendCount").get(function (this: IUser) {
  return this.friends.length;
});

const User = model<IUser>("User", userSchema);

export default User;
