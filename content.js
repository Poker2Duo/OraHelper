function createAddToOraButton() {
  const oraButton = document.createElement("button");
  oraButton.textContent = "Add to Ora";
  oraButton.classList.add("add-to-ora-button");

  if (window.location.href.includes("robota.ua")) {
    document.body.appendChild(oraButton);
  }

  oraButton.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    chrome.runtime.sendMessage({ action: "addToOra" });

    const positionSelector = 'h1.santa-typo-h3[data-id="vacancy-title"]';
    const companySelector = "div.santa-mr-10 > a > span";
    const salarySelector = '[data-id="vacancy-salary-from-to"]';
    const recruiterSelector = '[data-id="vacancy-contact-name"]';

    const position =
      document.querySelector(positionSelector)?.textContent.trim() || "";
    const company =
      document.querySelector(companySelector)?.textContent.trim() || "";
    const salary =
      document.querySelector(salarySelector)?.textContent.trim() || "";
    const recruiterName =
      document.querySelector(recruiterSelector)?.textContent.trim() || "";

    const vacancyLink = window.location.href;
    const trimmedVacancyLink = vacancyLink.split("?")[0];
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.style.display = "block";

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    modalContent.innerHTML = `
        <span class="close">&times;</span>
        <form id="addToOraForm">
          <div>
            <label for="position">Position:</label>
            <input type="text" id="position" name="position" value="${position}" placeholder="Enter position">
          </div>
          <div>
            <label for="company">Company:</label>
            <input type="text" id="company" name="company" value="${company}" placeholder="Enter company">
          </div>
          <div>
            <label for="vacancyLink">Vacancy Link:</label>
            <input type="text" id="vacancyLink" name="vacancyLink" value="${trimmedVacancyLink}" readonly>
          </div>
          <div>
            <label for="salaryRange">Salary Range:</label>
            <input type="text" id="salaryRange" name="salaryRange" value="${salary}" placeholder="Enter salary range">
          </div>
          <div>
            <label for="recruiterName">Recruiter's Name:</label>
            <input type="text" id="recruiterName" name="recruiterName" value="${recruiterName}" placeholder="Enter recruiter's name">
          </div>
          <button type="submit">Submit</button>
        </form>
      `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    document.body.classList.add("modal-open");

    const closeButton = modal.querySelector(".close");
    closeButton.addEventListener("click", function () {
      modal.remove();
      document.body.classList.remove("modal-open");
    });

    const form = modal.querySelector("#addToOraForm");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(form);

      // Log the form data to the console
      for (var value of formData.values()) {
        console.log(value);
      }

      // Get the project ID and list ID from Chrome's local storage
      chrome.storage.local.get(
        ["selectedProjectId", "selectedListId"],
        function (result) {
          const projectId = result.selectedProjectId;
          const listId = result.selectedListId;

          // Send the data to the Ora.pm project
          sendDataToOra(formData, projectId, listId);
        }
      );

      modal.remove();
      document.body.classList.remove("modal-open");
    });

    document.addEventListener("click", function closeOnOutsideClick(event) {
      if (!modalContent.contains(event.target)) {
        modal.remove();
        document.body.classList.remove("modal-open");
        document.removeEventListener("click", closeOnOutsideClick);
      }
    });
  });
}

function sendDataToOra(data, projectId, listId) {
  chrome.storage.local.get("access_token", function (result) {
    const accessToken = result.access_token;

    let markdownTable = `
| Key | Value |
|---|---|
`;

    for (const [key, value] of data.entries()) {
      markdownTable += `| ${key} | ${value} |\n`;
    }

    console.log(markdownTable);
    const body = {
      title: `${data.get("company")} | ${data.get("position")}`,
      description: markdownTable,
    };
    console.log(body);

    fetch(`https://api.ora.pm/projects/${projectId}/lists/${listId}/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data sent to Ora.pm:", data);
      })
      .catch((error) => {
        console.error("Error sending data to Ora.pm:", error);
      });
  });
}

window.addEventListener("load", createAddToOraButton);
