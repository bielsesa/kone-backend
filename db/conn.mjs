import mongoose from "mongoose";

const baseConnectionString = process.env.ATLAS_URI || "";
const dbName = process.env.DB_NAME || "";
const connectionParams = process.env.CONNECTION_PARAMS || "";

if (!baseConnectionString || !dbName || !connectionParams) {
    console.error("ATLAS_URI or DB_NAME or CONNECTION_PARAMS is not defined");
} else {
    const connectionString = `${baseConnectionString}/${dbName}?${connectionParams}`;
    console.log(`Using connection string: ${connectionString}`);

    mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log("MongoDB Connected"))
        .catch(err => console.error("Error connecting to MongoDB:", err));
}

export default mongoose;