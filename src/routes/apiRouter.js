import express from 'express';
import { __appdir } from '../app.js';
import { retrieveForms, submitForm } from '../controllers/apiController.js';
import { isAuthenticated } from '../controllers/authController.js';

const router = express.Router();

// For /api/

router.get('/forms', isAuthenticated, retrieveForms);

router.post('/forms', isAuthenticated, submitForm);

export default router;