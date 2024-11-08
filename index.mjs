// Load environment variables
import "./loadEnvironment.mjs";

// Connect MongoDB with Mongoose
import "./db/conn.mjs";

import express from "express";
import cors from "cors";

// Load routes
import buildings from "./routes/buildings.mjs";
import models from "./routes/models.mjs";
import authRouter from "./routes/auth.mjs";

// Load all middleware
import { authenticateToken } from "./middleware/auth.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/auth", authRouter);

// Load the /buildings routes, protected
app.use("/buildings", authenticateToken, buildings);

// Load the /models routes, protected
app.use("/models", authenticateToken, models);

// Global error handling
app.use((err, _req, res, next) => {
    res.status(500).send("Uh oh! An unexpected error occurred.");
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});