import express from 'express';
import Building from '../models/Building.mjs';
import User from "../models/User.mjs";
import fetchDataFromApi from "../utils/fetchDataFromApi.mjs";

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
router.post('/', async (req, res) => {
    try {
        const {
            id,
            name,
            address,
            zip,
            lat,
            lng,
            createdByUsername,
            imgBlueprint,
            jsonBlueprint,
            surfaceModel,
            undergroundModel,
            elevatorModel,
            surfaceFloors,
            undergroundFloors
        } = req.body;

        // Find the user by username
        const user = await User.findOne({ username: createdByUsername });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Create new building
        const newBuilding = new Building({
            id,
            name,
            address,
            zip,
            lat,
            lng,
            createdBy: user._id,
            imgBlueprint,
            jsonBlueprint,
            surfaceModel,
            undergroundModel,
            elevatorModel,
            surfaceFloors,
            undergroundFloors
        });

        const savedBuilding = await newBuilding.save();
        res.status(201).json(savedBuilding);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

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
router.get('/', async (req, res) => {
    try {
        const buildings = await Building.find().populate('createdBy', 'username');
        res.status(200).json(buildings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

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
router.get('/:id', async (req, res) => {
    try {
        const buildingId = req.params.id;
        const building = await Building.findById(buildingId).populate('createdBy', 'username');
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json(building);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


/**
 * @swagger
 * /buildings/{id}:
 *   put:
 *     summary: Update a building by ID
 *     description: Modify the details of an existing building by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the building to update
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
 *       400:
 *         description: Error updating building
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
router.put('/:id', async (req, res) => {
    try {
        const buildingId = req.params.id;
        const {
            id,
            name,
            address,
            zip,
            lat,
            lng,
            createdByUsername,
            imgBlueprint,
            jsonBlueprint,
            surfaceModel,
            undergroundModel,
            elevatorModel,
            surfaceFloors,
            undergroundFloors
        } = req.body;

        // Find the user by username if provided
        let user = null;
        if (createdByUsername) {
            user = await User.findOne({username: createdByUsername});
            if (!user) {
                return res.status(400).json({error: 'User not found'});
            }
        }

        // Find the building by ID and update it
        const updatedBuilding = await Building.findByIdAndUpdate(
            buildingId,
            {
                id,
                name,
                address,
                zip,
                lat,
                lng,
                ...(user && {createdBy: user._id}),
                imgBlueprint,
                jsonBlueprint,
                surfaceModel,
                undergroundModel,
                elevatorModel,
                surfaceFloors,
                undergroundFloors
            },
            {new: true, runValidators: true}
        );

        if (!updatedBuilding) {
            return res.status(404).json({error: 'Building not found'});
        }

        res.status(200).json(updatedBuilding);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});


router.post("/generate", async (req, res) => {
    const apiUrl = process.env.GENERATIVE_API_URI;

    // Get building from buildingId passed in the body
    const {buildingId} = req.body;
    if (!buildingId) {
        return res.status(400).send("Building ID is required");
    }

    try {
        const building = await Building.findById(buildingId);
        if (!building) {
            return res.status(404).send("Building not found");
        }

        // Get the jsonBlueprint from the building
        const {jsonBlueprint} = building;

        // Pass this data to the fetchDataFromApi method
        const data = await fetchDataFromApi(apiUrl, jsonBlueprint);

        // Update the building with the result received
        building.surfaceModel = data.above_file;
        building.undergroundModel = data.under_file;
        if (data.elevator_file != null) {
            building.elevatorModel = data.elevator_file;
        }

        // Save the updated building
        await building.save();

        res.status(200).json(building);
    } catch (error) {
        res.status(500).send("Error processing the request");
    }
});

export default router;