import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true
    },
    description: {
        type: String,
        required: [true, "Category description is required"]
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

CategorySchema.methods.toJSON = function () {
    const { __v, _id, ...category } = this.toObject();
    category.uid = _id;
    return category;
};

export default model('Category', CategorySchema);