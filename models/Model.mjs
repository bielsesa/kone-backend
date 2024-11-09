import mongoose from "../db/conn.mjs";
import { v4 as uuidV4 } from "uuid";

// Main model schema
const modelSchema = new mongoose.Schema({
    modelId: {
        type: String,
        default: uuidV4,
        unique: true,
        required: true
    },
    imgBlueprint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fs.files" // Reference to the files collection used by GridFS
    },
    jsonBlueprint: {
        type: Object
    },
    surfaceModel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fs.files" // Reference to the files collection used by GridFS
    },
    undergroundModel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fs.files" // Reference to the files collection used by GridFS
    },
    elevatorModel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fs.files" // Reference to the files collection used by GridFS
    },
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Building",
        required: true
    }
});

const Model = mongoose.model("Model", modelSchema);
export default Model;