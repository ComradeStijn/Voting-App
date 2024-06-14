document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#nav-home").classList.add("active");
  renderLogoutLink();
  refreshForms();

  document.querySelector("#refresh-forms").addEventListener("click", () => {
    refreshForms();
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

function refreshForms() {
  document.querySelector("#form-container").innerHTML = "";

  axios
    .get("/api/adminforms")
    .then((response) => {
      renderAllForms(response.data);
    })
    .catch((error) => {
      if (error.response) {
        console.log("Reponse status: ", error.response.status);
        console.log("Response data: ", error.response.data);
      } else if (error.request) {
        console.log("No response received: ", error.request);
      } else {
        console.log("Error: ", error.message);
      }
      if (error.response.status === 404) {
        console.log("Error: ", error.response.data.message);
      }
    });
}

function renderAllForms(forms) {
  const formContainer = document.querySelector("#form-container");
  const baseTemplate = `
            <article class="col-12 col-lg-6">
                <div class="p-3 border border-primary-subtle rounded-5 shadow">
                    <h3 class="text-center mb-2"></h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Choice</th>
                                <th>Votes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="total-vote-row">
                                <th></th>
                                <th></th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </article>
    `;
  console.log(forms);
  const range = document.createRange();
  range.selectNode(document.body);

  for (const form of forms) {
    const choices = JSON.parse(form.choices);
    const votes = JSON.parse(form.votes);
    const totalVotes = Object.values(votes).reduce(
      (acc, item) => (acc += item)
    );

    const articleElement = range.createContextualFragment(baseTemplate);
    const totalVoteRow = articleElement.querySelector(".total-vote-row");

    articleElement.querySelector("h3").textContent = form.title;
    articleElement.querySelector(
      ".total-vote-row th:nth-child(2)"
    ).textContent = totalVotes;

    for (const key in choices) {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      td1.textContent = choices[key];
      td2.textContent = votes[key];
      tr.append(...[td1, td2]);

      articleElement.querySelector("tbody").insertBefore(tr, totalVoteRow);
    }

    formContainer.append(articleElement);
  }
}
