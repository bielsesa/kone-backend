import dotenv from "dotenv";
dotenv.config();

// Log environment variables to ensure they are loaded properly
console.log("Environment variables loaded:", {
    ATLAS_URI: process.env.ATLAS_URI,
    PORT: process.env.PORT
});