const userDatabase = [
    { id: 1, userName: 'Stijn', userPwd: 'test'}
];

function authenticateUser(name, password) {
    for (const user of userDatabase) {
        if (name == user.userName && password == user.userPwd) {
            return user;
        }
    }
}

export default authenticateUser;