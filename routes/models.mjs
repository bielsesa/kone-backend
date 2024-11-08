// routes/models.mjs
import express from 'express';
import Building from '../models/Building.mjs';

const router = express.Router();

// Endpoint to receive model data from an external API and attach it to a building
router.post('/add-model', async (req, res) => {
    const { buildingId, model } = req.body;

    try {
        // Find the building by buildingId
        const building = await Building.findOne({ buildingId });
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }

        // Add the model data to the building's houses array
        building.models.push(model);

        // Save the updated building document
        await building.save();

        res.status(201).json(building);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a building along with their model information
router.get('/buildings/:id', async (req, res) => {
    try {
        const building = await Building.findById(req.params.id);
        if (!building) {
            return res.status(404).json({ error: 'Building not found' });
        }
        res.status(200).json(building);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;