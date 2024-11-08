import mongoose from "mongoose";

const connectionString = process.env.ATLAS_URI || "";

if (!connectionString) {
    console.error("ATLAS_URI is not defined");
} else {
    console.log(`Using connection string: ${connectionString}`);
}

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

export default mongoose;