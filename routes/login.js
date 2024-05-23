import express from 'express';
import { login } from '../controllers/authenticationController.js';
import path from 'path';
import { viewsDirectory } from '../app.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(viewsDirectory, 'login.html'));
})

router.post('/', login);

export default router;
