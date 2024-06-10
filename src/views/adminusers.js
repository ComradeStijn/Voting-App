document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#nav-home').classList.add('active');
    renderLogoutLink();
    refreshUsers();
    

    document.querySelector('#refresh-users').addEventListener('click', () => {
        refreshUsers();
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

function refreshUsers() {
    document.querySelector('tbody').innerHTML = '';

    axios.get('/api/adminusers')
        .then(response => {
            renderAllUsers(response.data);
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
}

function renderAllUsers(users) {
    const tableBody = document.querySelector('tbody');
    const baseTemplate = `
            <th></th>
            <td class="user-name"></td>
            <td class="user-token"></td>
            <td class="user-votes"></td>
            <td class="">
                <button class="btn btn-warning fw-bold me-2 mb-2 mb-lg-0 button-proxies">Change proxies</button>
                <button class="btn btn-danger fw-bold text-white button-delete">Delete user</button>
            </td>
    `;
    for (const user of users) {
        console.log(user);
        const tr = document.createElement('tr');
        tr.innerHTML = baseTemplate;
        tr.querySelector('th').textContent = user.id;
        tr.querySelector('.user-name').textContent = user.name;
        tr.querySelector('.user-token').textContent = user.token;
        tr.querySelector('.user-votes').textContent = user.votes;
        tableBody.append(tr);
    }


}