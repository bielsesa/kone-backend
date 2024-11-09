import mongoose from "mongoose";
import grid from "gridfs-stream";

const baseConnectionString = process.env.ATLAS_URI || "";
const dbName = process.env.DB_NAME || "";
const connectionParams = process.env.CONNECTION_PARAMS || "";

let gfs;

if (!baseConnectionString || !dbName || !connectionParams) {
    console.error("ATLAS_URI or DB_NAME or CONNECTION_PARAMS is not defined");
} else {
    const connectionString = `${baseConnectionString}/${dbName}?${connectionParams}`;
    console.log(`Using connection string: ${connectionString}`);

    const conn = mongoose.createConnection(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    conn.once("open", () => {
        // Initialize GridFS
        gfs = grid(conn.db, mongoose.mongo);
        gfs.collection("uploads");
        console.log("GridFS initialized");
    });

    mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log("MongoDB connected"))
        .catch(err => console.error("Error connecting to MongoDB:", err));
}

export default mongoose;
export { gfs };