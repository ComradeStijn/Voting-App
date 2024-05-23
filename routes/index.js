import express from 'express';
import isAuthenticated, { isAdmin } from '../controllers/authenticationController.js';


const router = express.Router();

router.get('/', isAuthenticated, isAdmin, (req, res) => {
    res.send('Hello');
})

export default router;