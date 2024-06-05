import express from 'express';
import { login, logout } from '../controllers/authController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/', login);

router.get('/logout', logout)

export default router;