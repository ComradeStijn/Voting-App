import modelRetrieve from '../models/formModel.js';

const retrieveForms = (req, res, next) => {
    console.log('Retrieve Forms Api invoked');
    const user_id = req.session.user.id;
    console.log(user_id);
    const forms = modelRetrieve(user_id);
    if (forms) {
        res.json(forms);
    } else {
        res.status(404).json({ message: 'No forms found'});
    }
};

export { retrieveForms };