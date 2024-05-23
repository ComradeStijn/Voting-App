import express from 'express';
import path from 'path';
const app = express();

app.set('views','./');
app.set('view-engine', 'ejs');
app.use(express.static('../static/'));

app.get('/', (req, res) => {
    res.render('layout.ejs');
})

app.listen(3000);