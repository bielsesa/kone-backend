import mongoose from "../db/conn.mjs";
import { v4 as uuidV4 } from "uuid";

// Common schema field options
const optionalString = { type: String, required: false };
const optionalNumber = { type: Number, required: false };

// Building schema definition
const buildingSchema = new mongoose.Schema({
    buildingId: { type: String, default: uuidV4, unique: true, required: true },
    name: optionalString,
    address: optionalString,
    zip: optionalString,
    lat: optionalNumber,
    lng: optionalNumber,
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
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