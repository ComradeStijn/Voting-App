import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'
import Database from 'better-sqlite3';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authenticationRoutes.js';
import apiRouter from './routes/apiRouter.js';

const app = express();
const port = process.env.PORT || 3000;
export const __appdir = path.dirname(fileURLToPath(import.meta.url));
export const __dbModels = path.join(__appdir,'models', 'database.db');

// DB creation
export const db = new Database(__dbModels);
db.pragma('journal_mode = WAL');
createDatabase();




app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['my-secret-key'],
    maxAge: 24 * 60 * 60* 1000
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__appdir, 'views'));
app.use(express.static(path.join(__appdir, 'views')));
app.use('/bootstrap', express.static(path.join(__appdir, '../node_modules/bootstrap/dist')));
app.use('/node_modules', express.static(path.join(__appdir, '../node_modules')));


app.use('/', authRouter);
app.use('/', userRouter);
app.use('/api', apiRouter);




app.use((err, req, res , next) => {
    console.log('General error handler');
    console.log(err.message);
    res.status(err.statusCode || 500).json({ message: err.message });
});


app.listen(port, () => {
    console.log(`App listening on ${port}`);
});







function createDatabase() {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            token TEXT NOT NULL,
            votes INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS forms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            choices TEXT,
            votes TEXT
        );

        CREATE TABLE IF NOT EXISTS userJunctionForm (
            user_id INTEGER NOT NULL,
            form_id INTEGER NOT NULL,
            voted INTEGER NOT NULL
        );
    `;
    try {
        db.exec(query);
        console.log('Created database');
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
    }
}