import mongoose from "../db/conn.mjs";
import { v4 as uuidV4 } from "uuid";

// Common schema field options
const requiredNumber = { type: Number, required: true };
const notRequiredString = { type: String, required: false };
const notRequiredNumber = { type: Number, required: false };

// Building schema definition
const buildingSchema = new mongoose.Schema({
    buildingId: { type: String, default: uuidV4, unique: true, required: true },
    floors: requiredNumber,
    floorHeight: requiredNumber,
    name: notRequiredString,
    lat: notRequiredNumber,
    lng: notRequiredNumber,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    model: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Model",
        required: false
    }
});

const Building = mongoose.model("Building", buildingSchema);
export default Building;