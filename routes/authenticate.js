import express from 'express';
import isAuthenticated, { login, logout } from '../controllers/authenticationController.js';


const router = express.Router();

router.all('/', isAuthenticated);// Will redirect to /login if not authenticated. Else will continue back to app.js

router.get('/login', (req, res) => {
    res.render('login.ejs');
});

router.post('/login', login, (req, res) => {
    res.redirect('/');
});

router.get('/logout', logout, (req, res) => {
    res.redirect('/');
})


export default router;
