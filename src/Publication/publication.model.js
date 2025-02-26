import { Schema, model } from "mongoose";

const PublicationSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    content: {
        type: String,
        required: [true, "Content is required"]
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

PublicationSchema.methods.toJSON = function () {
    const { __v, _id, ...publication } = this.toObject();
    publication.uid = _id;
    return publication;
};

export default model('Publication', PublicationSchema);