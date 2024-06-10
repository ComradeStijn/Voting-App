import { retrieveFormsByUserID, retrieveFormByFormID, addVotes, retrieveAllForms }  from '../models/formModel.js';
import { findUserByToken } from '../models/authModel.js';

const retrieveForms = (req, res, next) => {
    const user_id = req.session.user.id;
    console.log(`Retrieve forms for user: ${req.session.user.name}`);
    // Retrieve how many Votes the user has currently, since this could change whilst the session is going on.
    const totalVotes = findUserByToken(req.session.user.token).votes; 

    const forms = retrieveFormsByUserID(user_id);
    if (forms) {
        res.json({ forms, totalVotes});
    } else {
        console.log('Forms not found');
        res.status(404).json({ message: 'No forms found'});
    }
};

const adminRetrieveForms = (req, res, next) => {
    const retrieved = retrieveAllForms();
    if (retrieved) {
        res.json(retrieved);
    } else {
        console.log('Forms not found');
        res.status(404).json({ message: 'No forms found' });
    }
}



const submitForm = (req, res, next) => {
    console.log('Submit forms api invoked');

    const user_id = req.session.user.id;
    console.log(`Submit form for user: ${user_id}`);

    const requestData = req.body;

    if (Object.keys(requestData).length) {
        const formID = Number(requestData.formID);
        const form = retrieveFormByFormID(formID);


        // If the amount of choices in the form does not line up with the submitted votes per choice in the request
        if (Object.keys(form.choices).length !== Object.keys(requestData.choices).length) {
            console.log("Form choices do not equal request choices");
            const error = new Error('Error in apiController.js/submitForm. Request choices do not line up with form choices.')
            error.statusCode = 400;
            next(error);
        }

        try {
            addVotes(requestData, user_id);
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }

    }
}

export { retrieveForms, submitForm, adminRetrieveForms };

// Post request
// { formID: '1', choices: { option1: '3', option2: '0' } }

// Form in Database
// {
//   id: 1,
//   title: 'President',
//   choices: { option1: 'Anakin Skywalker', option2: 'Obi-Wan Kenobi' },
//   votes: { option1: 0, option2: 0 }
// }