document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#nav-home').classList.add('active');
    renderLogoutLink();




})


function renderLogoutLink() {
    const navLinks = document.querySelector('#header-navlink');
    const aElement = document.createElement('a');
    aElement.setAttribute('id', 'nav-logout');
    aElement.setAttribute('href', '/logout');
    aElement.classList.add('nav-link');
    aElement.innerHTML = '<h3>Logout</h3>';
    navLinks.append(aElement);
}