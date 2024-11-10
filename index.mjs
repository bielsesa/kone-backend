// Load environment variables
import "./loadEnvironment.mjs";

// Connect MongoDB with Mongoose
import "./db/conn.mjs";

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Load routes
import buildings from "./routes/buildings.mjs";
import authRouter from "./routes/auth.mjs";
import genApi from "./routes/python.mjs";

// Load all middleware
import { authenticateToken } from "./middleware/auth.js";
import helmet from "helmet";
import swaggerDefinition from "./swaggerDefinition.js";
import busboy from 'connect-busboy';

const PORT = process.env.PORT || 5050;
const app = express();

// Initialize Swagger-jsdoc
const specs = swaggerJsdoc({
    swaggerDefinition,
    apis: ["./routes/*.mjs"], // Define the paths to your route files
});

// Define CORS options to allow any origin
const corsOptions = {
    origin: "*", // Allows any origin
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
};

// Use middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(busboy());

app.options('*', cors(corsOptions));

// Authentication routes
app.use("/auth", authRouter);

// Load the /buildings routes, protected
// app.use("/buildings", authenticateToken, buildings);
app.use("/buildings", buildings);

// Use Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/python", genApi);

// Global error handling
app.use((err, _req, res, next) => {
    res.status(500).send("Uh oh! An unexpected error occurred.");
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});