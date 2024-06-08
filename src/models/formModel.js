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

const testForm = {
    formID: 1,
    choices: '{"option1":5,"option2":3}'
}


function addVotes(formData, user_id) {
    const choices = JSON.parse(formData.choices);
    console.log('choices: ', choices)
    const formID = formData.formID;
    const junctQuery = `
        SELECT *
        FROM userJunctionForm
        WHERE user_id = ?
        AND form_id = ?
    `;
    const formQuery = `
        SELECT *
        FROM forms
        WHERE id = ?
    `;
    const updateFormQuery = `
        UPDATE forms
        SET votes = ?
        WHERE id = ?
    `;

    const updateJunctionQuery = `
        UPDATE userJunctionForm
        SET voted = 1
        WHERE (user_id, form_id) = (?, ?)
    `;

    try {
        // Retrieve current data from junction table and form table for form and user
        const junctionToUpdate = db.prepare(junctQuery).get(user_id, formID);
        console.log('junctionToUpdate', junctionToUpdate)
        const currentData = db.prepare(formQuery).get(formID);
        const currentVotes = JSON.parse(currentData.votes);
        console.log('Current Votes', currentVotes)

        // If the user has not voted yet. Update the votes total with the new choices
        // and execute a sql query to update the votes in the form and to set the junction voted to true
        if (!junctionToUpdate.voted) {
            for (const option in choices) {
                console.log('option', option)
                console.log('currentVotes[option]', currentVotes[option]);
                console.log('Number(choices[option])', Number(choices[option]));
                currentVotes[option] += Number(choices[option]);
                console.log(currentVotes);
            };

            // Ensure that updating the votes in form and voted status in junction is done together
            const prepare1 = db.prepare(updateFormQuery);
            const prepare2 = db.prepare(updateJunctionQuery);
            const transaction = db.transaction(() => {
                prepare1.run(JSON.stringify(currentVotes), formID);
                prepare2.run(user_id, formID);
            });
            transaction();
            
        } else {
            const error =  new Error("User already voted for this form");
            error.statusCode = 400;
            throw error;
        }
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
        throw err;
    }
}


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



function testResetJunction() {
    const query = `
        UPDATE userJunctionForm
        SET voted = 0
        WHERE (user_id, form_id) = (?,?)
    `;

    db.prepare(query).run(1,1);
    db.prepare(query).run(1,2);
    db.prepare(query).run(1,3);
}


export { retrieveFormsByUserID, retrieveFormByFormID, addVotes }