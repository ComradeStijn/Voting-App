import express from 'express';
import { __appdir } from '../app.js';
import { retrieveForms } from '../controllers/apiController.js';

const router = express.Router();

router.get('/forms', retrieveForms);

export default router;