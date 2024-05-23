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
        if (!user) {
            const err = new Error('Invalid username or password');
            err.status = 401;
            return next(err);
        } else {
            req.session.user = {
                id: user.id,
                userName: user.userName,
                userRole: user.userRole,
            };
            next();
        }
    } catch (err) {
        if (err.name == 'AuthenticationError') {
            err.status = 401;
        }
        return next(err);
    }
}


export function logout(req, res, next) {
    req.session.destroy((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
}


export default function isAuthenticated(req, res, next) {
    if (req.session.user) {
        console.log('User is authenticated:', req.session.user.userName);
        next();
    } else {
        console.warn('User is not authenticated, Redirecting to login page.');
        res.redirect('/login');
    }
}

export function isAdmin(req, res, next) {
    if (req.session.user.userRole == 'admin') {
        next();
    } else {
        const err = new Error('User is not administrator');
        err.status = 401;
        return next(err);
    }
}