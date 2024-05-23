// This file is to test render .ejs files whilst working on them.

import express from 'express';
import path from 'path';
const app = express();

app.set('views','./');
app.set('view-engine', 'ejs');
app.use(express.static('../static/'));

app.get('/', (req, res) => {
    res.render('layout.ejs', { title: "test" });
})

app.listen(3000);