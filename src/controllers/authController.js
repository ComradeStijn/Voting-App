import { findUserByToken } from "../models/authModel.js";

const login = (req, res, next) => {
    console.log('login controller invoked');
    const token = req.body.token;
    const user = findUserByToken(token);
    if (user) {
        req.session.user = user;
        res.status(200).json({ success: true, message: 'Logged in succesfully'});
    } else {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

const logout = (req, res, next) => {
    req.session = null;
    res.redirect('/');
}

export { login, logout };