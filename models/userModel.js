const userDatabase = [
    { id: 1, userName: 'Stijn', userPwd: 'test'}
];

export default function authenticateUser(name, password) {
    if (typeof name == 'string' && typeof password == 'string') {
        for (const user of userDatabase) {
            if (name == user.userName && password == user.userPwd) {
                return user;
            }
        }
    } else return;
}

export function createUser(name, password) {
    if (typeof name == 'string' && typeof password == 'string') {
        let user = {
            id: userDatabase.length + 1,
            userName: name,
            userPwd: password,
        }
        userDatabase.push(user)
        return;
    } else return;
}


