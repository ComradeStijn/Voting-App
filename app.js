import express from 'express';
import path from 'path';
import url from 'url';
import session from 'express-session';
import { isAuthenticated } from './controllers/authenticationController.js';
import authenticationRouter from './routes/authenticationRoute.js';
import bodyParser from 'body-parser';

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
export const viewsDirectory = path.join(__dirname, 'views');

// Middleware
app.use(bodyParser.urlencoded({ extended: false}));


app.get('/', isAuthenticated, (req, res) => {
    res.send('logged in');
})

app.use('/login', authenticationRouter);

app.listen(port , () => {
    console.log(`Voting-app running on port ${port}`);
})