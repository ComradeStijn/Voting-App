import express from "express";
import path from 'path';
import { __appdir } from "../app.js";
const router = express.Router()

router.get('/', (req, res) => {
    console.log("Index being rendered");
    res.render('index');
});




export default router;

