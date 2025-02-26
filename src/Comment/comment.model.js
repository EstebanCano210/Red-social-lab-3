import { Schema, model } from "mongoose";

const CommentSchema = new Schema({
    content: {
        type: String,
        required: [true, "Content is required"]
    },
    publication: {
        type: Schema.Types.ObjectId,
        ref: 'Publication',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

CommentSchema.methods.toJSON = function () {
    const { __v, _id, ...comment } = this.toObject();
    comment.uid = _id;
    return comment;
};

export default model('Comment', CommentSchema);