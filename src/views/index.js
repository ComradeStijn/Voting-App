const loginForm = document.querySelector("#login-form");


loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const token = document.querySelector('#token').value;
    axios.post('/', { token: token })
        .then(response => {
            if (response.data.success) {
                window.location.href = '/index';
            } else {
                alert('not logged in');
            }
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

            if (error.response && error.response.status === 401) {
                renderLoginFail('#form-error-response', error);
            }
        })
});

function renderLoginFail(element, error) {
    const parentElement = document.querySelector(element);
    parentElement.innerHTML = '';
    const errorElement = document.createElement('div'); 
    errorElement.classList.add('btn', 'btn-danger', 'text-white', 'mb-3');
    errorElement.style.width = '100%';
    errorElement.textContent = `Login failed: ${error.response.data.message}`;
    parentElement.appendChild(errorElement);
}

