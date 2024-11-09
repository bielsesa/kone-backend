/**
 * @swagger
 * components:
 *   schemas:
 *     FileUpload:
 *       type: object
 *       required:
 *         - file
 *       properties:
 *         file:
 *           type: string
 *           format: binary
 *           description: The file to upload
 *     FileResponse:
 *       type: object
 *       properties:
 *         file:
 *           type: string
 *           description: The ID of the uploaded file
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         err:
 *           type: string
 *           description: The error message
 */

/**
 * @swagger
 * /files/upload:
 *   post:
 *     summary: Upload file to MongoDB using GridFS
 *     description: Upload a file to MongoDB's GridFS
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/FileUpload'
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileResponse'
 *       500:
 *         description: Error uploading file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /files/{id}:
 *   get:
 *     summary: Get file by ID from MongoDB using GridFS
 *     description: Retrieve a file by its ID from MongoDB's GridFS
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the file
 *     responses:
 *       200:
 *         description: File fetched successfully
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
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error fetching file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
import express from "express";
import { gfs } from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import { GridFSBucket } from 'mongodb';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// @route POST /files/upload
// @desc Upload file to MongoDB using GridFS
router.post("/upload", (req, res) => {
    if (!gfs) {
        return res.status(500).json({ err: "GridFSBucket not initialized" });
    }

    req.pipe(req.busboy);

    req.busboy.on('file', (fieldname, file, filename) => {
        const uploadStream = gfs.openUploadStream(filename, {
            contentType: file.mimetype
        });

        file.pipe(uploadStream);

        uploadStream.on('error', (error) => {
            console.error('Upload Error:', error);
            res.status(500).json({ err: 'Upload failed' });
        });

        uploadStream.on('finish', () => {
            res.status(201).json({ file: uploadStream.id });
        });
    });
});

// @route GET /files/:id
// @desc Get file by ID from MongoDB using GridFS
router.get("/:id", async (req, res) => {
    try {
        if (!gfs) {
            return res.status(500).json({ err: "GridFSBucket not initialized" });
        }

        const fileId = new ObjectId(req.params.id);

        const files = await gfs.find({ _id: fileId }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ err: "No file exists" });
        }

        const file = files[0];

        res.set('Content-Type', file.contentType);
        const readstream = gfs.openDownloadStream(fileId);
        readstream.pipe(res);

    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).send('Error fetching file');
    }
});

export default router;