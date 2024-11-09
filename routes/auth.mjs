/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username
 *         password:
 *           type: string
 *           description: The user's password
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             username: user123
 *             password: pass123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User created successfully
 *       500:
 *         description: Error signing up user
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Error signing up user
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in
 *     description: Logs in a user and returns a JWT token with a 2-day expiration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             username: user123
 *             password: pass123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: your_jwt_token
 *       401:
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Invalid username or password
 *       500:
 *         description: Error logging in user
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Error logging in user
 */

// routes/auth.mjs
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';

const router = express.Router();

// Sign up route
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send("User created successfully");
    } catch (error) {
        res.status(500).send("Error signing up user");
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send("Invalid username or password");
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send("Invalid username or password");
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '2d',
        });

        res.json({ token });
    } catch (error) {
        res.status(500).send("Error logging in user");
    }
});

export default router;