import mongoose from "../db/conn.mjs";
import { v4 as uuidV4 } from "uuid";

// Define sub-schema for STL and GLB file information with versioning
const modelFileSchema = new mongoose.Schema({
    version: {
        type: Number,
        required: true
    },
    twoDimensions: {
        type: Object,
        required: true
    },
    glb: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fs.files", // Reference to the files collection used by GridFS
        required: true
    }
}, { _id: false }); // _id: false to avoid creating _id for sub-documents

// Main model schema
const modelSchema = new mongoose.Schema({
    modelId: {
        type: String,
        default: uuidV4,
        unique: true,
        required: true
    },
    surfaceModel: {
        type: [modelFileSchema],
        required: true
    },
    undergroundModel: {
        type: [modelFileSchema],
        required: false
    },
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Building",
        required: true
    }
});

const Model = mongoose.model("Model", modelSchema);
export default Model;