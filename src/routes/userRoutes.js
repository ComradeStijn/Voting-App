import express from "express";
import { __appdir } from "../app.js";
const router = express.Router()

router.get('/', (req, res) => {
    console.log("User.ejs being rendered");
    res.render('user', { name: req.session.user.name});
});




export default router;

