import express from 'express';
import Building from '../models/Building.mjs';
import User from "../models/User.mjs";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Building:
 *       type: object
 *       required:
 *         - buildingId
 *         - createdBy
 *       properties:
 *         buildingId:
 *           type: string
 *           description: The unique ID of the building
 *         name:
 *           type: string
 *           description: The name of the building
 *         address:
 *           type: string
 *           description: The address of the building
 *         zip:
 *           type: string
 *           description: The zip code of the building's location
 *         lat:
 *           type: number
 *           description: The latitude of the building's location
 *         lng:
 *           type: number
 *           description: The longitude of the building's location
 *         createdByUsername:
 *           type: string
 *           description: The username of the user who created the building
 *         model:
 *           type: string
 *           description: The ID of the associated model
 */

/**
 * @swagger
 * /buildings:
 *   post:
 *     summary: Create a new building
 *     description: Add a new building to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               zip:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               createdByUsername:
 *                 type: string
 *               model:
 *                 type: string
 *     responses:
 *       201:
 *         description: Building created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Building'
 *       400:
 *         description: Error creating building
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
 * /buildings:
 *   get:
 *     summary: Get all buildings
 *     description: Retrieve a list of all buildings
 *     responses:
 *       200:
 *         description: A list of buildings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Building'
 *       400:
 *         description: Error retrieving buildings
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
 * /buildings/{id}:
 *   get:
 *     summary: Get a building by ID
 *     description: Retrieve a single building by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the building
 *     responses:
 *       200:
 *         description: Building found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Building'
 *       404:
 *         description: Building not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       400:
 *         description: Error retrieving building
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
 * /buildings/{id}:
 *   put:
 *     summary: Update a building by ID
 *     description: Update the details of a building by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the building
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               zip:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               createdByUsername:
 *                 type: string
 *               model:
 *                 type: string
 *     responses:
 *       200:
 *         description: Building updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Building'
 *       404:
 *         description: Building not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       400:
 *         description: Error updating building
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

// Create a new building
router.post('/', async (req, res) => {
    const {name, address, zip, lat, lng, createdByUsername, model} = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({username: createdByUsername}).exec();
        if (!user) {
            return res.status(400).json({error: 'User not found'});
        }

        const building = new Building({
            name,
            address,
            zip,
            lat,
            lng,
            createdBy: user._id,
            model,
            createdAt: new Date()
        });
        const savedBuilding = await building.save();
        res.status(201).json(savedBuilding);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

// Retrieve all buildings
router.get('/', async (req, res) => {
    try {
        const buildings = await Building.find();
        res.status(200).json(buildings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Retrieve a building by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const building = await Building.findById(id);
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json(building);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a building by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const building = await Building.findByIdAndUpdate(id, updates, { new: true });
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json(building);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a building by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const building = await Building.findByIdAndDelete(id);
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json({ message: 'Building deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;