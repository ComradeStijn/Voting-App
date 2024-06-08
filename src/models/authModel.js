import { db } from "../app.js";

const userArray = [
    { id: 1, name: "Stijn Doe", token: "123123123", votes: 3},
    { id: 2, name: "Kean Doe", token: "456456456", votes: 1},
];


export function modifyUserById(id, property, newValue) {
    const updateQuery = `UPDATE users SET ${property} = ? WHERE id = ?`;
    try {
        return db.prepare(updateQuery).run(newValue, id);
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
    }
}

export function deleteUserById(id) {
    const deleteQuery = 'DELETE FROM users WHERE id = ?';
    try {
        return db.prepare(deleteQuery).run(id);
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
    }
}

export function findUserByToken(token) {
    const findQuery = 'SELECT * FROM users WHERE token = ?';
    const transformedToken = token.toString();
    try {
        return db.prepare(findQuery).get(transformedToken);
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
    }
}


export function findAllUsers() {
    const selectQuery = 'SELECT * FROM users';
    try {
        const users = db.prepare(selectQuery).all();
        return users;
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
    }
}

export function createUser(name, token, votes) {
    const insertQuery = 'INSERT INTO users (name, token, votes) VALUES (?,?,?)';
    try {
        return db.prepare(insertQuery).run(name.toString(), token.toString(), votes);
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
    }
}



