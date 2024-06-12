/* eslint-disable no-undef */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#nav-home").classList.add("active");
  renderLogoutLink();
  refreshUsers();

  document.querySelector("#refresh-users").addEventListener("click", () => {
    refreshUsers();
  });

  document.querySelector("#new-user").addEventListener("click", () => {
    document.querySelector("#user-form-toggle").classList.toggle("d-none");
  });

  document
    .querySelector("#create-user-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      userFormSubmit(e);
    });
});

function renderLogoutLink() {
  const navLinks = document.querySelector("#header-navlink");
  const aElement = document.createElement("a");
  aElement.setAttribute("id", "nav-logout");
  aElement.setAttribute("href", "/logout");
  aElement.classList.add("nav-link");
  aElement.innerHTML = "<h3>Logout</h3>";
  navLinks.append(aElement);
}

function refreshUsers() {
  document.querySelector("tbody").innerHTML = "";

  axios
    .get("/api/adminusers")
    .then((response) => {
      renderAllUsers(response.data);
    })
    .catch((error) => axiosErrorHandler(error));
}

function renderAllUsers(users) {
  const tableBody = document.querySelector("tbody");
  const baseTemplate = `
            <th class="user-id"></th>
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
    const tr = document.createElement("tr");
    tr.innerHTML = baseTemplate;
    tr.querySelector(".user-id").textContent = user.id;
    tr.querySelector(".user-name").textContent = user.name;
    tr.querySelector(".user-token").textContent = user.token;
    tr.querySelector(".user-votes").textContent = user.votes;

    // Set data attribute to allow change proxy input field to have a placeholder
    tr.querySelector(".button-proxies").setAttribute(
      "data-user-votes",
      user.votes
    );
    tableBody.append(tr);
  }

  // Change proxies
  document
    .querySelectorAll(".button-proxies")
    .forEach((button) =>
      button.addEventListener("click", (e) => proxyButton(e, button))
    );

  // Delete button
  document
    .querySelectorAll(".button-delete")
    .forEach((button) =>
      button.addEventListener("click", (e) => postDeleteUser(e, button))
    );
}

function proxyButton(e, button) {
  e.preventDefault();
  const parentTR = button.closest("tr");
  const proxyTD = parentTR.querySelector(".user-votes");

  const user_id = parentTR.querySelector(".user-id").textContent;
  proxyTD.innerHTML = `
        <div class="input-group">
            <input type="number" class="form-control" id="new-proxy" placeholder="#" min="1" max="5" required>
            <button class="btn btn-outline-secondary" type="button">✓</button>
        </div>
    `;
  proxyTD.querySelector("input").value = button.dataset.userVotes;

  //
  const submitButton = proxyTD.querySelector("button");
  submitButton.addEventListener("click", () => {
    const newProxyValue = proxyTD.querySelector("#new-proxy").value || 1;
    postRequestWithNewProxy(user_id, newProxyValue, proxyTD);
  });
}

function postRequestWithNewProxy(user_id, newValue) {
  axios
    .post("/api/setproxy", { user_id, newValue })
    .then((response) => {
      if (response.status === 200) {
        refreshUsers();
      }
    })
    .catch((error) => axiosErrorHandler(error));
}

function postDeleteUser(e, button) {
  e.preventDefault();
  const parentTR = button.closest("tr");
  const user_id = parentTR.querySelector(".user-id").textContent;

  axios
    .post("/api/deleteuser", { user_id })
    .then((response) => {
      if (response.status === 200) {
        refreshUsers();
      }
    })
    .catch((error) => axiosErrorHandler(error));
}

function userFormSubmit(event) {
  const form = event.target;
  const nameInput = form.querySelector("#newuser-name");
  const voteInput = form.querySelector("#newuser-votes");
  const nameValue = nameInput.value;
  const voteValue = voteInput.value;

  axios
    .post("/api/createuser", { nameValue, voteValue })
    .then((response) => {
      if (response.status === 200) {
        refreshUsers();
        nameInput.value = null;
        voteInput.value = null;
      }
    })
    .catch((error) => axiosErrorHandler(error));
}

function renderAlert() {
  const template = `
        <div class="mt-3 alert alert-danger alert-dismissible fade show" role="alert">
            <span>Error. Please try again.</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
  document.querySelector("#warning-container").innerHTML = template;
}

function axiosErrorHandler(error) {
  if (error.response) {
    console.log("Reponse status: ", error.response.status);
    console.log("Response data: ", error.response.data);
  } else if (error.request) {
    console.log("No response received: ", error.request);
  } else {
    console.log("Error: ", error.message);
  }
  renderAlert();
}
