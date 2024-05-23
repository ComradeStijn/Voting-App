import authenticate from '../models/userModel.js';

export async function login(req, res, next) {
    const { userName, userPwd } = req.body;
    if (!userName || !userPwd) {
        const err = new Error('Invalid username or password');
        err.status = 401;
        next(err);
    }
    try {
        const user = await authenticate(userName, userPwd);
        if (user) {
            req.session.user = {
                id: user.id,
                userName: user.userName,
            };
            next();
        }
    } catch (err) {next(err)};
}



export function logout(req, res, next) {
    req.session.destroy((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
}

export default function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}