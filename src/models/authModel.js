import { db } from "../app.js";



export function modifyUserById(id, property, newValue) {
    const updateQuery = `UPDATE users SET ${property} = ? WHERE id = ?`;
    try {
        return db.prepare(updateQuery).run(newValue, id);
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
        throw err;
    }
}

export function deleteUserById(id) {
    const deleteQuery = 'DELETE FROM users WHERE id = ?';
    try {
        return db.prepare(deleteQuery).run(id);
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
        throw err;
    }
}

export function findUserByToken(token) {
    const findQuery = 'SELECT * FROM users WHERE token = ?';
    const transformedToken = token.toString();
    try {
        return db.prepare(findQuery).get(transformedToken);
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
        throw err;
    }
}


export function retrieveAllUsers() {
    const selectQuery = 'SELECT * FROM users';
    try {
        const users = db.prepare(selectQuery).all();
        return users;
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
        throw err;
    }
}


export function setProxy(user_id, newProxy) {
    const query = `UPDATE users SET votes=? WHERE id=?`
    try {
        db.prepare(query).run(newProxy, user_id);
        return;
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
        throw err;
    }
}


