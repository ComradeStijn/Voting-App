import { findUserByToken } from "../models/authModel.js";

const login = (req, res, next) => {
    const token = req.body.token;
    const user = findUserByToken(token);
    if (user) {
        req.session.user = user;
        console.log(`${user.name} logged in.`);
        res.status(200).json({ success: true, message: 'Logged in succesfully', redirect: '/user'});
    } else {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

const adminlogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        console.log('Admin account logged in succesfully');
        req.session.admin = true;
        res.status(200).json({ success: true, message: 'Logged in succesfully', redirect: '/admin'});
    } else {
        res.status(401).json({ success: false, message: 'Invalid username or password'});
    }
}



const logout = (req, res, next) => {
    req.session = null;
    res.redirect('/');;
};


const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
}

const isAdmin = (req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        res.redirect('/');
    }
}

export { login, adminlogin, logout, isAuthenticated, isAdmin };