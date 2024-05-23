import express from 'express';
import path from 'path';
import url from 'url';
import session from 'express-session';
import { isAuthenticated } from './controllers/authenticationController.js';

const app = express();
const port = 3000;

// Replicate __dirname
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(session({
    secret: 'test-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));



app.listen(port , () => {
    console.log(`Voting-app running on port ${port}`);
})