import modelRetrieve from '../models/formModel.js';
import { findUserByToken } from '../models/authModel.js';

const retrieveForms = (req, res, next) => {
    console.log('Retrieve Forms Api invoked');

    const user_id = req.session.user.id;
    console.log(`Retrieve forms for user: ${user_id}`);
    // Retrieve how many Votes the user has currently, since this could change whilst the session is going on.
    const totalVotes = findUserByToken(req.session.user.token).votes; 

    const forms = modelRetrieve(user_id);
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

    const data = req.body;
    if (Object.keys(data).length) {
        console.log(data);
    }

}

export { retrieveForms, submitForm };