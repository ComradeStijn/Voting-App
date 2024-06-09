const formContainer = document.querySelector('#form-container');
const reloadButton = document.querySelector('#btn-reload-form');
const navLinks = document.querySelector('#header-navlink');


document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#nav-home').classList.add('active');
    renderLogoutLink();
    reloadForms();
    reloadButton.addEventListener('click', reloadForms);

    
});


function reloadForms() {
    reloadButton.firstElementChild.classList.remove('d-none');
    reloadButton.children[1].textContent = "loading...";
    formContainer.innerHTML = "";
    
    let totalVotes = 0;
    
    axios.get('/api/forms')
        .then(response => {
            const data = response.data;
            totalVotes = data.totalVotes,
            console.log(data);
            for (const form of data.forms) {
                renderForm(form, data.totalVotes);
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
            if (error.response.status === 404) {
                console.log('Error: ', error.response.data.message);
            }
        })
        .finally(() => {
            const allSubmitButtons = document.querySelectorAll('.form-submit-button');
            allSubmitButtons.forEach((button) => {
                button.addEventListener('click', (event) => {
                    submitButton(event, totalVotes)
                });
            });
        });

    reloadButton.firstElementChild.classList.add('d-none');
    reloadButton.children[1].textContent = "Reload Forms";
};


function submitButton(event, totalVotes) {
    const button = event.target;
    const formElement = button.parentNode;
    const errorDiv = formElement.querySelector('.card-error');
    button.disabled = true;

    const submittedVote = { formID: formElement.getAttribute('id'), choices: {}};
    let actualVotes = 0;

    const optionDivs = formElement.querySelectorAll('.option-div');
    for (const div of optionDivs) {
        const selectElement = div.querySelector('select');
        submittedVote.choices[selectElement.id] = selectElement.value;
        actualVotes += Number(selectElement.value);
    } 

    if (totalVotes !== actualVotes) {
        console.log('Votes submitted does not equal proxyvotes');
        errorDiv.innerHTML = ""
        errorDiv.classList.add('alert', 'alert-danger', 'mt-3');
        errorDiv.textContent = `You did not submit the correct amount of votes. You have ${totalVotes} votes in total.`;
        button.disabled = false;
    } else {
        console.log(submittedVote);



        axios.post('/api/forms', submittedVote)
            .then(response => {
                console.log('Response', response.data);
                // Remove card
            }).catch(error => {
                console.log(error);
                errorDiv.classList.add('alert', 'alert-danger', 'mt-3');
                if (error.response) {
                    errorDiv.textContent = `Error ${error.response.status} ${error.response.statusText}: ${error.response.data.message}`;
                } else {
                    errorDiv.textContent = `Error 500 Internal Server Error. Server could not be reached. Contact administrator.`
                }
                button.disabled = false;
            })
    };
};






// The below function creates and renders the following form card in formContainer
// 
// 
// 
// 
//                  <article class="card col-md-6 col-12">
//                     <div class="card-body">
//                         <h5 class="card-title fw-bold text-center">President</h5>
//                         <form action="#" class="card-body">
//                             <div class="mb-3 option-div">
//                                 <label for="candidate1" class="form-label">Anakin Skywalker</label>
//                                 <select class="form-select col-6" name="candidate1" id="candidate1">
//                                     <option value="0" selected>0</option>
//                                     <option value="1">1</option>
//                                     <option value="2">2</option>
//                                 </select>
//                             </div>
//                             <div class="mb-3 option-div">
//                                 <label for="candidate2" class="form-label">Obi-Wan Kenobi</label>
//                                 <select name="candidate2" id="candidate2" class="form-select">
//                                     <option value="0" selected>0</option>
//                                     <option value="1">1</option>
//                                     <option value="2">2</option>
//                                 </select>
//                             </div>
//                             <button type="button" class="btn btn-outline-primary">Submit</button>
//                              <div class="card-error"></div>
//                         </form>
//                     </div>
//                 </article>

function renderForm(form, totalVotes) {
    const articleElement = document.createElement('article');
    articleElement.classList.add('card', 'col-md-6', 'col-12');
    formContainer.append(articleElement);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    articleElement.appendChild(cardBody);

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title', 'fw-bold', 'text-center');
    cardTitle.textContent = form.title;
    cardBody.appendChild(cardTitle);

    const formElement = document.createElement('form');
    formElement.classList.add('card-body');
    formElement.setAttribute('id', form.id);
    cardBody.appendChild(formElement);

    for (const option in form.choices) {
        const divElement = document.createElement('div');
        divElement.classList.add('mb-3', 'option-div');
        formElement.appendChild(divElement);

        const label = document.createElement('label');
        label.setAttribute('for', option);
        label.classList.add('form-label');
        label.textContent = form.choices[option];
        divElement.appendChild(label);

        const selectElement = document.createElement('select');
        selectElement.setAttribute('name', option);
        selectElement.setAttribute('id', option);
        selectElement.classList.add('form-select');
        divElement.appendChild(selectElement);

        for (let value = 0; value <= totalVotes; value++) {
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', value);
            optionElement.textContent = value;
            selectElement.appendChild(optionElement);
        }
    }

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'button');
    submitButton.classList.add('btn', 'btn-outline-primary', 'form-submit-button');
    submitButton.textContent = `Submit for ${form.title}`;
    formElement.appendChild(submitButton);

    // Error container for form validation
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('card-error');
    formElement.appendChild(errorDiv);
    
};


function renderLogoutLink() {
    const aElement = document.createElement('a');
    aElement.setAttribute('id', 'nav-logout');
    aElement.setAttribute('href', '/logout');
    aElement.classList.add('nav-link');
    aElement.innerHTML = '<h3>Logout</h3>';
    navLinks.append(aElement);
}