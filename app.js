import express from 'express';
import path from 'path';
import url from 'url';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authenticate.js';

const app = express();
const port = 3000;

app.use(session({
    secret: 'test-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Replicate __dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'static')));
app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'ejs')

// Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

app.use('/', authRouter);

app.all('/', (req, res) => {
    res.send('Good');
})


app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send({
        error: {message: err.message || 'Internal server error'}
    });
})

app.listen(port , () => {
    console.log(`Voting-app running on port ${port}`);
})