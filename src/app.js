import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';

const app = express();
const port = 3000;

// app.use(helmet());
app.use(cookieParser())
app.use(cookieSession({
    name: 'session',
    keys: ['my-secret-key'],
    maxAge: 24 * 60 * 60* 1000
}));


app.get('/set-session', (req, res) => {
    req.session.user = { name: 'john doe' };
    console.log(req.session.user);
    if (req.session.user) {
        res.send('Session cookie has been set');
    } else {
        res.send('error');
    }
})

app.get('/read-session', (req, res) => {
    const user = req.session.user;
    res.json(user || 'No session data');
})

app.get('/clear-session', (req, res) => {
    req.session = null;
    res.send('Session cookie has been cleared');
})








app.listen(port, () => {
    console.log(`App listening on ${port}`);
})

