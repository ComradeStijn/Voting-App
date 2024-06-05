import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = 3000;
export const __appdir = path.dirname(fileURLToPath(import.meta.url));

app.use(helmet());
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['my-secret-key'],
    maxAge: 24 * 60 * 60* 1000
}));

app.use(express.static(path.join(__appdir, 'views')));



app.use('/', userRouter);







app.listen(port, () => {
    console.log(`App listening on ${port}`);
});

