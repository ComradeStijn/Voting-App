document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.querySelector('#form-container');
    const reloadButton = document.querySelector('#btn-reload-form');


    reloadButton.addEventListener('click', reloadForms);

    function reloadForms() {
        reloadButton.firstElementChild.classList.remove('d-none');
        reloadButton.children[1].textContent = "loading...";
        
        axios.get('/api/forms')
            .then(response => {
                const data = response.data;
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
            })
    };
});