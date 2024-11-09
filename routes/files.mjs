import express from "express";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { gfs } from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Configure storage engine for GridFS
const storage = new GridFsStorage({
    url: `${process.env.ATLAS_URI}/${process.env.DB_NAME}?${process.env.CONNECTION_PARAMS}`,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = `${Date.now()}-${file.originalname}`;
            const fileInfo = {
                filename,
                bucketName: "uploads"
            };
            resolve(fileInfo);
        });
    }
});
const upload = multer({ storage });

// @route POST /files/upload
// @desc Upload file to MongoDB using GridFS
router.post("/upload", upload.single("file"), (req, res) => {
    res.status(201).json({ file: req.file });
});

// @route GET /files/:id
// @desc Get file by ID from MongoDB using GridFS
router.get("/:id", (req, res) => {
    const fileId = new ObjectId(req.params.id);
    gfs.files.findOne({ _id: fileId }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({ err: "No file exists" });
        }

        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    });
});

export default router;