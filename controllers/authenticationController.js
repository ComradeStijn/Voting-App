import authenticate from '../models/userModel.js';


export async function login(req, res, next) {
    const { userName, userPwd } = req.body;
    
    // Datafields not provided
    if (!userName || !userPwd) {
        const err = new Error('Invalid username or password');
        err.status = 401;
        next(err);
    }
    try {
        const user = await authenticate(userName, userPwd);
        if (!user) { // if user does not exist
            const err = new Error('Invalid username or password');
            err.status = 401;
            return next(err);
        } else {
            req.session.user = { // Store id, name and role in session cookie
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
    req.session.destroy((err) => {  // destroy cookie session
        if (err) return next(err);
        res.redirect('/');
    });
}


export default function isAuthenticated(req, res, next) {  // Redirect to login page if not authenticated
    if (req.session.user) {
        console.log('User is authenticated:', req.session.user.userName);
        next();
    } else {
        console.warn('User is not authenticated, Redirecting to login page.');
        res.redirect('/login');
    }
}

export function isAdmin(req, res, next) {  // Throw error when user attempts to access admin route
    if (req.session.user.userRole == 'admin') {
        next();
    } else {
        const err = new Error('User is not administrator');
        err.status = 401;
        return next(err);
    }
}