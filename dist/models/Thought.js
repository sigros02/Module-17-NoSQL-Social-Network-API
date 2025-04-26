import { Schema, Types, model } from "mongoose";
import { DateTime } from "luxon";
const reactionSchema = new Schema({
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
        get: (createdAt) => {
            return DateTime.fromJSDate(createdAt).toLocaleString(DateTime.DATETIME_FULL);
        },
    },
}, {
    toJSON: {
        getters: true,
    },
});
const thoughtSchema = new Schema({
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
        get: (createdAt) => {
            return DateTime.fromJSDate(createdAt).toLocaleString(DateTime.DATETIME_FULL);
        },
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema], // Array of reactionSchema
}, {
    toJSON: {
        virtuals: true,
        getters: true,
    },
    timestamps: true,
});
thoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});
const Thought = model("Thought", thoughtSchema);
export default Thought;
