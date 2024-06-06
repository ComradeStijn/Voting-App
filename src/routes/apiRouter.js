import express from 'express';
import { __appdir } from '../app.js';
import { retrieveForms, submitForm } from '../controllers/apiController.js';

const router = express.Router();

router.get('/forms', retrieveForms);

router.post('/forms', submitForm);

export default router;