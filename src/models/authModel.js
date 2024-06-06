

const userArray = [
    { id: 1, name: "Stijn Doe", token: "123123123", votes: 3},
    { id: 2, name: "Kean Doe", token: "456456456", votes: 1},
];


export function findUserByToken(token) {
    const user =  userArray.find((user) => {
        return user.token === token;
    });
    return user;
}

