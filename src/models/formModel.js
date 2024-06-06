const formArray = [
    {id: 0},
    {id: 1, title: 'President', choices: {option1: 'Anakin Skywalker', option2: 'Obi-Wan Kenobi'}, votes: {option1: 0, option2: 0}},
    {id: 2, title: 'Vice-President', choices: {option1: 'Padmé Amidala', option2: 'Sheev Palpatine', option3: 'Finis Valorum'}, votes: {option1: 0, option2: 0, option3: 0}},
    {id: 3, title: 'Motion to create a Grand Army of the Republic', choices: {option1: 'Yes', option2: 'No'}, votes: {option1: 0, option2: 0}}
];

const userJunctionForm = [
    {user_id: 1, form_id: 1, voted: false},
    {user_id: 1, form_id: 2, voted: false},
    {user_id: 1, form_id: 3, voted: false}
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




function retrieveFormsByUserID(user_id) {
    // Using the junction table, return the non-voted forms for user
    const nonVotedFormIDs = userJunctionForm.filter((junction) => {
        return junction.user_id === user_id && !junction.voted;
    })
        .map(junction => junction.form_id);
    
    const forms = formArray.filter(form => {
        return nonVotedFormIDs.includes(form.id);
    });
    if (forms.length) {
        return forms;
    };
    return;
};

function retrieveFormByFormID(form_id) {
    return formArray.filter((form) => form.id === form_id);
}


export { retrieveFormsByUserID, retrieveFormByFormID, addVotes }