import express from 'express';
import { logout } from '../controllers/authenticationController.js';
import path from 'path';

const router = express.Router();
router.get('/', logout);

export default router;