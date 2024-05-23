import authenticate from '../models/userModel.js';

export function login(req, res) {
    const { userName, userPwd } = req.body;
    if (!userName || !userPwd) {
        res.status(401).send('Invalid username or password');
    }
    const user = authenticate(userName, userPwd);
    if (user) {
        req.session.user = user;
        res.redirect('/');
    }
}

export function logout(req, res) {
    req.session.destroy();
    res.redirect('/');
}

export function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}