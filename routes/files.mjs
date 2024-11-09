/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The automatically generated ID of the file
 *         filename:
 *           type: string
 *           description: The name of the file
 *         contentType:
 *           type: string
 *           description: The MIME type of the file
 *         length:
 *           type: integer
 *           description: The size of the file in bytes
 *         uploadDate:
 *           type: string
 *           format: date-time
 *           description: The date when the file was uploaded
 */

/**
 * @swagger
 * /files/upload:
 *   post:
 *     summary: Upload file
 *     description: Upload a file to MongoDB using GridFS
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file:
 *                   $ref: '#/components/schemas/File'
 *       400:
 *         description: Error uploading file
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */

/**
 * @swagger
 * /files/{id}:
 *   get:
 *     summary: Get file
 *     description: Get a file by ID from MongoDB using GridFS
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the file
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 */

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