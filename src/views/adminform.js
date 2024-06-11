document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#nav-home').classList.add('active');
    renderLogoutLink();
    refreshForms();



    document.querySelector('#refresh-forms').addEventListener('click', () => {
        refreshForms();
    });

    document.querySelector('#new-form').addEventListener('click', () => {
        document.querySelector('#form-form-toggle').classList.toggle('d-none');
    });

    document.querySelector('#create-form-form').addEventListener('submit', (e) => {
        e.preventDefault();
        formFormSubmit(e);
    })
});

function renderLogoutLink() {
    const navLinks = document.querySelector('#header-navlink');
    const aElement = document.createElement('a');
    aElement.setAttribute('id', 'nav-logout');
    aElement.setAttribute('href', '/logout');
    aElement.classList.add('nav-link');
    aElement.innerHTML = '<h3>Logout</h3>';
    navLinks.append(aElement);
}

function refreshForms() {
    document.querySelector('tbody').innerHTML = '';

    axios.get('/api/adminforms')
        .then(response => {
            renderAllForms(response.data);
        })
        .catch(error => axiosErrorHandler(error));
}

function renderAllForms(forms) {
    const tableBody = document.querySelector('tbody');
    const baseTemplate = `
        <tr>
            <th class="form-id"></th>
            <td class="form-title"></td>
            <td class="form-choices">
                <ul class="list-group list-group-flush"></ul>
            </td>
            <td class="">
                <button class="btn btn-danger fw-bold text-white button-delete">Delete form</button>
            </td>
        </tr>
    `;

    for (const form of forms) {
        const tr = document.createElement('tr');
        tr.innerHTML = baseTemplate;
        tr.querySelector('.form-id').textContent = form.id;
        tr.querySelector('.form-title').textContent = form.title;
        const ul = tr.querySelector('ul');
        
        const choices = JSON.parse(form.choices);
        for (const index in choices) {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = choices[index];

            ul.append(li);
        }
        tableBody.append(tr);
    }

    // Delete button
    document.querySelectorAll('.button-delete').forEach(button => button.addEventListener('click', (e) => postDeleteForm(e, button)));
}




function postDeleteForm(e, button) {
    e.preventDefault();
    const parentTR = button.closest('tr');
    const form_id = parentTR.querySelector('.form-id').textContent;

    axios.post('/api/deleteform', { form_id })
        .then(response => {
            if (response.status === 200) {
                refreshForms();
            }
        })
        .catch(error => axiosErrorHandler(error));
}




function formFormSubmit(event) {
    const form = event.target;
    const optionInputs = Array.from(form.querySelectorAll('.options'));
    const title = form.querySelector('#newform-name').value;
    const formData = { title };

    const optionObject = {}
    for (const option of optionInputs) {
        if (option.value !== '') {
            optionObject[option.id] = option.value;
        }
    }
    formData['choices'] = JSON.stringify(optionObject);

    axios.post('/api/createform', formData)
        .then(response => {
            if (response.status === 200) {
                refreshForms();
            }
        })
        .catch(error => axiosErrorHandler(error));
}



function renderAlert() {
    const template = `
        <div class="mt-3 alert alert-danger alert-dismissible fade show" role="alert">
            <span>Error. Please try again.</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    document.querySelector('#warning-container').innerHTML = template;
}

function axiosErrorHandler(error) {
    if (error.response) {
        console.log("Reponse status: ", error.response.status);
        console.log("Response data: ", error.response.data);
    } else if (error.request) {
        console.log('No response received: ', error.request);
    } else {
        console.log('Error: ', error.message);
    }
    renderAlert();
}