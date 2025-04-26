import { Schema, model, type Document } from "mongoose";
import { DateTime } from "luxon";

interface IThoughts extends Document {
  thoughtText: string;
  createdAt: Date | string;
  username: string;
  reactions: Schema.Types.ObjectId[];
}

const thoughtSchema = new Schema<IThoughts>(
  {
    thoughtText: {
      type: String,
      required: true,
      max_length: 280,
      min_length: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      // need to add getter to format the date
      get: (createdAt: Date) => {
        return DateTime.fromJSDate(createdAt).toLocaleString(
          DateTime.DATETIME_FULL
        );
      },
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "reaction",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    timestamps: true,
  }
);

thoughtSchema.virtual("reactionCount").get(function (this: IThoughts) {
  return this.reactions.length;
});

const Thought = model<IThoughts>("Thought", thoughtSchema);

export default Thought;
