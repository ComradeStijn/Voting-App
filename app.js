import express from 'express';
import path from 'path';
import url from 'url';
import session from 'express-session';
import isAuthenticated from './controllers/authenticationController.js';
import loginRouter from './routes/login.js';
import logoutRouter from './routes/logout.js';
import mainRouter from './routes/index.js';
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


app.get('/', isAuthenticated, mainRouter);

app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

app.listen(port , () => {
    console.log(`Voting-app running on port ${port}`);
})