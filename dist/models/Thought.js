import { Schema, model } from "mongoose";
import { DateTime } from "luxon";
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
    reactions: [
        {
            type: Schema.Types.ObjectId,
            ref: "reaction",
        },
    ],
}, {
    toJSON: {
        virtuals: true,
        getters: true,
    },
    timestamps: true,
});
const Thought = model("Thought", thoughtSchema);
export default Thought;
