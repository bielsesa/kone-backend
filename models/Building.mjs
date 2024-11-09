import mongoose from "../db/conn.mjs";
import { v4 as uuidV4 } from "uuid";

// Common schema field options
const requiredString = { type: String, required: false };
const notRequiredString = { type: String, required: false };
const requiredNumber = { type: Number, required: false };

// Building schema definition
const buildingSchema = new mongoose.Schema({
    buildingId: { type: String, default: uuidV4, unique: true, required: true },
    name: requiredString,
    createdBy: requiredString,
    address: notRequiredString,
    city: notRequiredString,
    zip: notRequiredString,
    lat: requiredNumber,
    lng: requiredNumber,
    floors: requiredNumber,
    floorHeight: requiredNumber,
    models: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Model"
    }]
});

const Building = mongoose.model("Building", buildingSchema);
export default Building;