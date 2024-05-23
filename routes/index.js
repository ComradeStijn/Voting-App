import express from 'express';
import isAuthenticated from '../controllers/authenticationController.js';

const router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
    res.send('Hello');
})

export default router;