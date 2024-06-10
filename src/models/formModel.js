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
    const choices = formData.choices;
    const formID = formData.formID;

    const junctJoinFormQuery = `
        SELECT f.votes AS formVotes, j.voted as hasVoted
        FROM forms f
        JOIN userJunctionForm j on f.id = j.form_id
        WHERE j.user_id = ? and f.id = ?
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
        const data = db.prepare(junctJoinFormQuery).get(user_id, formID);

        if (data.hasVoted) {
            const error =  new Error("User already voted for this form");
            error.statusCode = 400;
            throw error;
        }

        const currentVotes = JSON.parse(data.formVotes);
        for (const option in choices) {
            currentVotes[option] += Number(choices[option]);
        };

        const transaction = db.transaction(() => {
            db.prepare(updateFormQuery).run(JSON.stringify(currentVotes), formID);
            db.prepare(updateJunctionQuery).run(user_id, formID);
        });
        transaction();
        console.log(`User ${user_id} has voted for form ${formID}`);
        
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
        throw error;
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
        throw err;
    }
}

function retrieveAllForms() {
    const query = `SELECT * FROM forms`;
    try {
        const retrieved = db.prepare(query).all();
        return retrieved;
    } catch (err) {
        console.error(`Error ${err.code}: ${err.message}`);
        throw err;
    }

}


function testResetJunction() {
    const query = `
        UPDATE userJunctionForm
        SET voted = 0
        WHERE (user_id, form_id) = (?,?)
    `;
    const query2 = `
        UPDATE forms
        SET votes = '{"option1":0,"option2":0}'
    `;

    db.prepare(query).run(1,1);
    db.prepare(query).run(1,2);
    db.prepare(query).run(1,3);
    db.prepare(query2).run();
}


export { retrieveFormsByUserID, retrieveFormByFormID, addVotes, retrieveAllForms }