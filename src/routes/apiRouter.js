import express from 'express';
import { __appdir } from '../app.js';
import { adminRetrieveForms, adminRetrieveUsers, retrieveForms, submitForm } from '../controllers/apiController.js';
import { isAdmin, isAuthenticated } from '../controllers/authController.js';

const router = express.Router();

// For /api/

router.get('/forms', isAuthenticated, retrieveForms);

router.post('/forms', isAuthenticated, submitForm);

router.get('/adminforms', isAdmin, adminRetrieveForms);

router.get('/adminusers', isAdmin, adminRetrieveUsers)

export default router;