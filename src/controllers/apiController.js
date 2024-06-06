import { retrieveFormsByUserID, retrieveFormByFormID, addVotes }  from '../models/formModel.js';
import { findUserByToken } from '../models/authModel.js';

const retrieveForms = (req, res, next) => {
    console.log('Retrieve Forms Api invoked');

    const user_id = req.session.user.id;
    console.log(`Retrieve forms for user: ${user_id}`);
    // Retrieve how many Votes the user has currently, since this could change whilst the session is going on.
    const totalVotes = findUserByToken(req.session.user.token).votes; 

    const forms = retrieveFormsByUserID(user_id);
    if (forms) {
        console.log('Forms found.');
        console.log(req.session.user.votes);
        res.json({ forms, totalVotes});
    } else {
        console.log('Forms not found');
        res.status(404).json({ message: 'No forms found'});
    }
};





const submitForm = (req, res, next) => {
    console.log('Submit forms api invoked');

    const user_id = req.session.user.id;
    console.log(`Submit form for user: ${user_id}`);

    const requestData = req.body;

    if (Object.keys(requestData).length) {
        const formID = Number(requestData.formID);
        const form = retrieveFormByFormID(formID)[0];


        // If the amount of choices in the form does not line up with the submitted votes per choice in the request
        if (Object.keys(form.choices).length !== Object.keys(requestData.choices).length) {
            console.log("Form choices do not equal request choices");
            res.status(400).json({ message: 'Amount of choices do not line up with database'});
        }

        try {
            addVotes(requestData, user_id);
        } catch (error) {
            next(error);
        }

    }
}

export { retrieveForms, submitForm };

// Post request
// { formID: '1', choices: { option1: '3', option2: '0' } }

// Form in Database
// {
//   id: 1,
//   title: 'President',
//   choices: { option1: 'Anakin Skywalker', option2: 'Obi-Wan Kenobi' },
//   votes: { option1: 0, option2: 0 }
// }