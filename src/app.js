import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authenticationRoutes.js';

const app = express();
const port = 3000;
export const __appdir = path.dirname(fileURLToPath(import.meta.url));

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
app.use('/index', userRouter);




app.use((err, req, res , next) => {
    console.log('General error handler');
    res.status(err.statusCode || 500).json({ error: err.message });
});


app.listen(port, () => {
    console.log(`App listening on ${port}`);
});

