import express from 'express';
import * as authenticateController from '../controllers/authenticationController.js';
import path from 'path';

const router = express.Router();
router.get('/', authenticateController.logout);

export default router;