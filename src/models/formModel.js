import { db } from "../app.js";

const formArray = [
    {id: 0},
    {id: 1, title: 'President', choices: {option1: 'Anakin Skywalker', option2: 'Obi-Wan Kenobi'}, votes: {option1: 0, option2: 0}},
    {id: 2, title: 'Vice-President', choices: {option1: 'Padmé Amidala', option2: 'Sheev Palpatine', option3: 'Finis Valorum'}, votes: {option1: 0, option2: 0, option3: 0}},
    {id: 3, title: 'Motion to create a Grand Army of the Republic', choices: {option1: 'Yes', option2: 'No'}, votes: {option1: 0, option2: 0}}
];

const userJunctionForm = [
    {user_id: 1, form_id: 1, voted: false},
    {user_id: 1, form_id: 2, voted: false},
];

// Post request
// { formID: '1', choices: { option1: '3', option2: '0' } }

function addVotes(formData, user_id) {
    const { formID, choices } = formData;
    const junctionToUpdate = userJunctionForm.find(junction => user_id == junction.user_id && formID == junction.form_id )

    if (!junctionToUpdate.voted) {
        for (const index in choices) {
            formArray[formID].votes[index] += Number(choices[index]);
        };
        junctionToUpdate.voted = true;
    } else {
        const error =  new Error("User already voted for this form");
        error.statusCode = 400;
        throw error;
    }
}

// function tomake(formData, user_id) {
//     const { formID, choices } = formData;
//     const junctForm = 


// }

function retrieveFormsByUserID(user_id) {
    const query = `
        SELECT f.id, f.title, f.choices, f.votes
        FROM forms AS f INNER JOIN userJunctionForm AS j
        ON f.id = j.form_id
        WHERE j.user_id = ?
        AND j.voted = 0
    `;

    try {
        const retrieved = db.prepare(query).all(user_id)
        const toReturn = [];

        for (const row of retrieved) {
            const transformedRow = {
                id: row.id,
                title: row.title,
                choices: JSON.parse(row.choices),
                votes: JSON.parse(row.votes)
            }
            toReturn.push(transformedRow);
        }
        return toReturn;
    } catch (error) {
        console.error(`Error ${error.code}: ${error.message}`);
    }
}


function retrieveFormByFormID(form_id) {
    const query = `
        SELECT *
        FROM forms
        WHERE id = ?
    `;

    try {
        const retrieved = db.prepare(query).get(form_id);
        return {
            id: retrieved.id,
            title: retrieved.title,
            choices: JSON.parse(retrieved.choices),
            votes: JSON.parse(retrieved.votes),
        }
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
    }
}






export { retrieveFormsByUserID, retrieveFormByFormID, addVotes }