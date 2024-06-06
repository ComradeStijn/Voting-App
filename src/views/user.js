const formContainer = document.querySelector('#form-container');
const reloadButton = document.querySelector('#btn-reload-form');

document.addEventListener('DOMContentLoaded', () => {
    reloadButton.addEventListener('click', reloadForms);

    
});

function renderForm(form) {

};




function reloadForms() {
    reloadButton.firstElementChild.classList.remove('d-none');
    reloadButton.children[1].textContent = "loading...";
    
    axios.get('/api/forms')
        .then(response => {
            const forms = response.data;
            console.log(forms);
        })
        .catch(error => {
            if (error.response) {
                console.log("Reponse status: ", error.response.status);
                console.log("Response data: ", error.response.data);
            } else if (error.request) {
                console.log('No response received: ', error.request);
            } else {
                console.log('Error: ', error.message);
            }
            if (error.response.status === 404) {
                console.log('Error: ' + error.response.data.message);
            }
        });

    reloadButton.firstElementChild.classList.add('d-none');
    reloadButton.children[1].textContent = "Reload Forms";
};