import express from 'express';
import isAuthenticated, { isAdmin } from '../controllers/authenticationController.js';


const router = express.Router();

router.all('/', isAuthenticated, (req, res) => {
    if (req.session.user.userRole === 'admin') {
        res.redirect('/dashboard');
    } else {
        res.send('Home');
    }
})

router.get('/dashboard', isAuthenticated, isAdmin, (req, res) => {
    res.send('Dashboard');
})

export default router;