import { retrieveFormsByUserID, retrieveFormByFormID, addVotes, retrieveAllForms }  from '../models/formModel.js';
import { checkUniqueToken, findUserByToken, retrieveAllUsers, setProxy } from '../models/authModel.js';
import { createUser, deleteForm, deleteUser } from '../models/createModel.js';

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


const adminRetrieveForms = (req, res, next) => {
    const retrieved = retrieveAllForms();
    if (retrieved) {
        res.json(retrieved);
    } else {
        console.log('Forms not found');
        res.status(404).json({ message: 'No forms found' });
    }
}

const adminRetrieveUsers = (req, res, next) => {
    const retrieved = retrieveAllUsers();
    if (retrieved) {
        res.json(retrieved);
    } else {
        console.log('Users not found');
        res.status(400).json({ message: 'No users found' });
    }
}

const adminSetProxyOfUser = (req, res, next) => {
    const user_id = Number(req.body.user_id);
    const newVotes = Number(req.body.newValue);
    try {
        setProxy(user_id, newVotes);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(400);
    }
    
}

const adminDeleteUser = (req, res, next) => {
    const user_id = Number(req.body.user_id);
    try {
        deleteUser(user_id);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(400);
    }
}

const adminCreateUser = (req, res, next) => {
    const user_name = req.body.nameValue;
    const user_votes = Number(req.body.voteValue);
    while (true) {
        const user_token = random10Digit();
        if (checkUniqueToken(user_token)) {
            try {
                createUser(user_name, user_token, user_votes);
                res.sendStatus(200);
            } catch (err) {
                res.sendStatus(400);
            }
        }
        break;
    }
}

function random10Digit() {
    let digits = '';
    for (let i = 0; i < 10; i++) {
        digits += Math.floor(Math.random() * 10).toString();
    }
    return Number(digits);
}


const adminDeleteForm = (req, res, next) => {
    const form_id = Number(req.body.form_id);
    try {
        deleteForm(form_id);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(400);
    }
}


export { 
    retrieveForms, 
    submitForm, 
    adminRetrieveForms, 
    adminRetrieveUsers, 
    adminSetProxyOfUser, 
    adminDeleteUser, 
    adminCreateUser,
    adminDeleteForm,
};

