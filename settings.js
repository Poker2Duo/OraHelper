chrome.storage.local.get("access_token", function (data) {
  const accessToken = data.access_token;

  if (accessToken) {
    fetch("https://api.ora.pm/projects", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        const projectList = document.getElementById("projects");
        const ul = document.createElement("ul");

        data.data.forEach((project) => {
          const option = document.createElement("option");
          option.textContent = project.title;
          option.value = project.id;
          projectList.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    const refreshListsButton = document.getElementById("refreshLists");
    refreshListsButton.addEventListener("click", function () {
      const projectSelect = document.getElementById("projects");
      const selectedProjectId = projectSelect.value;
      if (!selectedProjectId) {
        console.error("No project selected");
        return;
      }

      chrome.storage.local.get("access_token", function (data) {
        const accessToken = data.access_token;

        if (accessToken) {
          fetch(`https://api.ora.pm/projects/${selectedProjectId}/lists`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              const listsSelect = document.getElementById("lists");
              listsSelect.innerHTML = "";
              data.data.forEach((list) => {
                const option = document.createElement("option");
                option.textContent = list.title;
                option.value = list.id;
                listsSelect.appendChild(option);
              });
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        } else {
          console.error("Access token not found in chrome.storage");
        }
      });
    });
  } else {
    console.error("Access token not found in chrome.storage");
  }
});

document.addEventListener();
