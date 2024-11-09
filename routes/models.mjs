import express from 'express';
import Model from '../models/Model.mjs';
import Building from '../models/Building.mjs';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Model:
 *       type: object
 *       required:
 *         - modelId
 *         - surfaceModel
 *         - building
 *       properties:
 *         modelId:
 *           type: string
 *           description: The unique ID of the model
 *         surfaceModel:
 *           type: array
 *           description: STL and GLB file with versioning for the surface model
 *           items:
 *             type: object
 *             properties:
 *               version:
 *                 type: number
 *                 description: The version number of the model
 *               stl:
 *                 type: object
 *                 description: The STL file information
 *               glb:
 *                 type: string
 *                 description: The ID of the GLB file in GridFS
 *         undergroundModel:
 *           type: array
 *           description: STL and GLB file with versioning for the underground model
 *           items:
 *             type: object
 *             properties:
 *               version:
 *                 type: number
 *                 description: The version number of the model
 *               stl:
 *                 type: object
 *                 description: The STL file information
 *               glb:
 *                 type: string
 *                 description: The ID of the GLB file in GridFS
 *         building:
 *           type: string
 *           description: The ID of the associated building
 */

/**
 * @swagger
 * /models/add-model:
 *   post:
 *     summary: Add model to a building
 *     description: Attach model data to a building
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buildingId:
 *                 type: string
 *                 description: The unique ID of the building
 *               modelData:
 *                 type: object
 *                 description: The model data to add
 *     responses:
 *       201:
 *         description: Model data added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Model'
 *       400:
 *         description: Error adding model data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Building not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /models/buildings/{id}:
 *   get:
 *     summary: Get building by ID
 *     description: Retrieve a building along with its model information
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the building
 *     responses:
 *       200:
 *         description: Building retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Building'
 *       400:
 *         description: Error retrieving building
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Building not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

// Add model to a building
router.post('/add-model', async (req, res) => {
    const { buildingId, modelData } = req.body;

    try {
        // Find the building by buildingId
        const building = await Building.findOne({ buildingId });
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }

        // Create a new model
        const model = new Model({ ...modelData, building: building._id });

        // Save the model
        const savedModel = await model.save();

        // Update the building's reference to the model
        building.model = savedModel._id;
        await building.save();

        res.status(201).json(savedModel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Retrieve a building along with its model information by building ID
router.get('/buildings/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the building by ID and populate the model field
        const building = await Building.findById(id).populate('model');
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json(building);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;