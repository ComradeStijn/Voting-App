import express from 'express';
import * as authenticateController from '../controllers/authenticationController.js';
const router = express.Router();

router.get('/login', authenticateController.login);
router.post('/login', authenticateController.logout);



export default router;
