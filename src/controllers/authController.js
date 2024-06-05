import { findUserByToken } from "../models/authModel.js";

const login = (req, res, next) => {
    console.log('login controller invoked');
    const token = req.body.token;
    console.log(token);
    const user = findUserByToken(token);
    if (user) {
        req.session.user = user;
        res.redirect('/index');
    } else {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export { login };