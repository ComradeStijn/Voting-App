import { db } from "../app.js";

// { id: 1, name: 'Stijn Servaes', token: '123123123', votes: 3 }

// {
//     id: 1,
//     title: 'President',
//     choices: '{"option1":"Anakin Skywalker","option2":"Obi-Wan Kenobi"}',
//     votes: '{"option1":3,"option2":0}'
// }

const testChoices = [
    {choices: '{"option1":"Anakin Skywalker","option2":"Obi-Wan Kenobi"}'},
    {choices: '{"option1":"John Doe","option2":"Jane Doe","option3":"Gert Verhulst"}'},
    {choices: '{"option1":"Stijn Servaes","option2":"No"}'},
    {choices: '{"option1":"Yes","option2":"No"}'},
]



export function createForm(title, choices) {
    try {
        const parsedChoices = JSON.parse(choices.choices);
        const votes = {};
        for (const index in parsedChoices) {
            votes[index] = 0;
        }

        const userList = db.prepare('SELECT id FROM users').all().map(row => row.id);
        const formQuery = db.prepare(`INSERT INTO forms (title, choices, votes) VALUES (?, ?, ?)`);
        const junctionQuery = db.prepare(`INSERT INTO userJunctionForm (user_id, form_id, voted) VALUES (?, ?, 0)`);

        const transaction = db.transaction(() => {
            const insertedRow = formQuery.run(title, choices.choices , JSON.stringify(votes));
            for (const user_id of userList) {
                junctionQuery.run(user_id, insertedRow.lastInsertRowid);
            }
        });
        transaction();
        console.log(`Form ${title}, has been created.`);
        return;
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
        throw err;
    }
}




export function createUser(name, token, votes) {
    try {
        const formArray = db.prepare('SELECT id FROM forms').all().map(row => row.id);

        const userQuery = db.prepare(`INSERT INTO users (name, token, votes) VALUES (?, ?, ?)`);
        const junctionQuery = db.prepare(`INSERT INTO userJunctionForm (user_id, form_id, voted) VALUES (?, ?, 0)`);

        const transaction = db.transaction(() => {
            const insertedRow = userQuery.run(name, token.toString(), votes);
            console.log('insertedRow', insertedRow);
            for (const form_id of formArray) {
                junctionQuery.run(insertedRow.lastInsertRowid, form_id);
            }
        });
        transaction();
        console.log(`User ${name} has been created.`)
        return;
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
        throw err;
    }
}

