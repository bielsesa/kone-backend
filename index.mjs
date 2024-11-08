// Load environment variables first
import "./loadEnvironment.mjs";

// Ensure connection is established after environment variables are loaded
import "./db/conn.mjs";

import express from "express";
import cors from "cors";

import buildings from "./routes/buildings.mjs";
import models from "./routes/models.mjs";

const PORT = process.env.PORT || 5050; // Updated from 5000 to match .env file
const app = express();

app.use(cors());
app.use(express.json());

// Load the /buildings routes
app.use("/buildings", buildings);

// Load the /models routes
app.use("/models", models);

// Global error handling
app.use((err, _req, res) => {
    res.status(500).send("Uh oh! An unexpected error occurred.")
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});