/**
 * @swagger
 * components:
 *   schemas:
 *     ExternalData:
 *       type: object
 *       properties:
 *         field1:
 *           type: string
 *           description: Example field from external data
 *         field2:
 *           type: string
 *           description: Example field from external data
 */

/**
 * @swagger
 * /external-data:
 *   get:
 *     summary: Fetch external data
 *     description: Retrieve data from an external API
 *     responses:
 *       200:
 *         description: Data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExternalData'
 *       500:
 *         description: Error fetching data from the external API
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Error fetching data from the external API
 */

import express from "express";
import fetchDataFromApi from "../utils/fetchDataFromApi.mjs";

const router = express.Router();

router.post("/generate", async (req, res) => {
    const apiUrl = process.env.GENERATIVE_API_URI;

    try {
        const data = await fetchDataFromApi(apiUrl, req.body);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send("Error fetching data from the external API");
    }
});

export default router;