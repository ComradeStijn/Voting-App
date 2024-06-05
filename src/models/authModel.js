

const userArray = [
    { id: 1, name: "Stijn Doe", token: "123123123"},
    { id: 2, name: "Kean Doe", token: "456456456"},
];


export function findUserByToken(token) {
    const user =  userArray.find((user) => {
        return user.token === token;
    });
    return user;
}

