const formArray = [
    {id: 1, title: 'President', choices: {option1: 'Anakin Skywalker', option2: 'Obi-Wan Kenobi'}},
    {id: 2, title: 'Vice-President', choices: {option1: 'Padmé Amidala', option2: 'Sheev Palpatine', option3: 'Finis Valorum'}},
    {id: 3, title: 'Motion to create a Grand Army of the Republic', choices: {option1: 'Yes', option2: 'No'}}
];

const userJunctionForm = [
    {user_id: 1, form_id: 1, voted: false},
    {user_id: 1, form_id: 2, voted: false},
    {user_id: 1, form_id: 3, voted: false}
];


function retrieveForms(user_id) {
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



export default retrieveForms;