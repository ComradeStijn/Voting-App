import express from "express";
import { __appdir } from "../app.js";
import { isAuthenticated } from "../controllers/authController.js";
const router = express.Router()

// For /

router.get('/user', isAuthenticated, (req, res) => {
    res.render('user', { name: req.session.user.name});
});





export default router;

