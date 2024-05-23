import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./models/database.db', (err) => {
    if (err) {
            console.error('Error connecting to database');
    } else {
        console.log('Connected to database');
    }
})


const userDatabase = [
    { id: 1, userName: 'Stijn', userPwd: 'test', userRole: 'admin'},
    { id: 2, userName: 'Kean', userPwd: 'test', userRole: 'user'},
];



export default async function authenticateUser(name, password) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE userName = ?   AND userPwd = ?';
        db.get(query, [name, password], (err, user) => {
            if (err) {
                console.error('Error executing query:', err.message);
                reject(err);
            } else {
                resolve(user);
            }
        })
    })
}

// export function createUser(name, password) {
//     if (typeof name == 'string' && typeof password == 'string') {
//         let user = {
//             id: userDatabase.length + 1,
//             userName: name,
//             userPwd: password,
//         }
//         userDatabase.push(user)
//         return;
//     } else return;
// }


