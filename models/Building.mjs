import mongoose from "../db/conn.mjs";
import { v4 as uuidV4 } from "uuid";

// Common schema field options
const optionalString = { type: String, required: false };
const optionalNumber = { type: Number, required: false };
const emptyString = { type: String, default: "", required: false };

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
        default: "testuser"
    },
    imgBlueprint: emptyString,
    jsonBlueprint: {
        type: Object
    },
    surfaceModel: emptyString,
    undergroundModel: emptyString,
    elevatorModel: emptyString,
    surfaceFloors: optionalNumber,
    undergroundFloors: optionalNumber,
});

const Building = mongoose.model("Building", buildingSchema);
export default Building;