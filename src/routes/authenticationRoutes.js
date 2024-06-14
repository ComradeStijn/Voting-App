import express from 'express';
import { login, logout, adminlogin } from '../controllers/authController.js';

const router = express.Router();



router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/user');
    } else if (req.session.admin) {
        res.redirect('/admin');
    } else {
        res.render('index');
    }
});

router.post('/', login);

router.get('/logout', logout);


router.get('/adminlogin', (req, res) => {
    if (req.session.admin) {
        res.redirect('/admin');
    } else {
        res.render('adminLogin');
    }
});

router.post('/adminlogin', adminlogin)



export default router;