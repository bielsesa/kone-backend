import mongoose from "../db/conn.mjs";
import { v4 as uuidV4 } from "uuid";

// 3D model schema definition
const modelSchema = new mongoose.Schema({
    modelId: {
        type: String,
        default: uuidV4,
        unique: true,
        required: true
    },
    model: {
        type: Object,
        required: true
    },
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Building"
    },
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fs.files", // Reference to the files collection used by GridFS
        required: true
    }
});

const Model = mongoose.model("Model", modelSchema);
export default Model;