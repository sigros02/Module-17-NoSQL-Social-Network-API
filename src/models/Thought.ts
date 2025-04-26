import { Schema, Types, model, type Document } from "mongoose";
import { DateTime } from "luxon";

interface IReaction extends Document {
  reactionId: Schema.Types.ObjectId;
  reactionBody: string;
  username: string;
  createdAt: Date | string;
}

interface IThoughts extends Document {
  thoughtText: string;
  createdAt: Date | string;
  username: string;
  reactions: Schema.Types.ObjectId[];
}

const reactionSchema = new Schema<IReaction>(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      max_length: 280,
    },
    username: {
      type: String,
      required: true,
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
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

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
    reactions: [reactionSchema], // Array of reactionSchema
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
