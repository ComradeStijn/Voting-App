const formContainer = document.querySelector('#form-container');
const reloadButton = document.querySelector('#btn-reload-form');

const testForm = {
    id: 1,
    title: "President",
    choices: {
        option1: 'Anakin Skywalker',
        option2: 'Obi-Wan Kenobi'
    }
}

const testForm2 = {
    id: 2,
    title: "Vice-President",
    choices: {
        option1: 'Padmé Amidala',
        option2: 'Sheev Palpatine',
        option3: 'Velorum'
    }
}


document.addEventListener('DOMContentLoaded', () => {
    reloadForms();
    reloadButton.addEventListener('click', reloadForms);

    
});


function reloadForms() {
    reloadButton.firstElementChild.classList.remove('d-none');
    reloadButton.children[1].textContent = "loading...";
    formContainer.innerHTML = "";
    
    axios.get('/api/forms')
        .then(response => {
            const data = response.data;
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
                console.log('Error: ' + error.response.data.message);
            }
        });

    reloadButton.firstElementChild.classList.add('d-none');
    reloadButton.children[1].textContent = "Reload Forms";
};









// The below function creates and renders the following element in formContainer
// 
// 
// 
// 
// <article class="card col-md-6 col-12">
//                     <div class="card-body">
//                         <h5 class="card-title fw-bold text-center">President</h5>
//                         <form action="#" class="card-body">
//                             <div class="mb-3">
//                                 <label for="candidate1" class="form-label">Anakin Skywalker</label>
//                                 <select class="form-select col-6" name="candidate1" id="candidate1">
//                                     <option value="0" selected>0</option>
//                                     <option value="1">1</option>
//                                     <option value="2">2</option>
//                                 </select>
//                             </div>
//                             <div class="mb-3">
//                                 <label for="candidate2" class="form-label">Obi-Wan Kenobi</label>
//                                 <select name="candidate2" id="candidate2" class="form-select">
//                                     <option value="0" selected>0</option>
//                                     <option value="1">1</option>
//                                     <option value="2">2</option>
//                                 </select>
//                             </div>
//                             <button type="button" class="btn btn-outline-primary">Submit</button>
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
    cardBody.appendChild(formElement);

    for (const option in form.choices) {
        const divElement = document.createElement('div');
        divElement.classList.add('mb-3');
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
    submitButton.classList.add('btn', 'btn-outline-primary');
    submitButton.textContent = `Submit for ${form.title}`;
    formElement.appendChild(submitButton);
    
};


