import express from "express";
import path from 'path';
import { __appdir } from "../app.js";
const router = express.Router()

router.get('/index', (req, res, next) => {
    console.log("this is used");
    res.sendFile('index.html', { root: path.join(__appdir, 'views')});
});


router.use((err, req, res, next) => {
    console.log('error handler')
    res.status(err.statusCode).json({ error: err.message });
})

export default router;

