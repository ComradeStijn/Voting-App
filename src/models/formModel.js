const formArray = [
    {id: 1, title: 'First title', body: 'First Body'},
    {id: 2, title: 'Second Second', body: 'Second Body'},
    {id: 3, title: 'Third Third', body: 'Third Body'}
];

const userJunctionForm = [
    {user_id: 1, form_id: 1, voted: false},
    {user_id: 1, form_id: 2, voted: false},
    {user_id: 1, form_id: 3, voted: true}
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