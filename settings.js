async function main() {
  const accessToken = await getAccessToken();
  const projects = await fetchProjects(accessToken);
  const projectDropdown = document.getElementById("projects");

  projects.data.forEach((project) => {
    const option = document.createElement("option");
    option.textContent = project.title;
    option.value = project.id;
    projectDropdown.appendChild(option);
  });

  await refreshLists(accessToken, projectDropdown.value);

  projectDropdown.addEventListener("change", async (event) => {
    await refreshLists(accessToken, event.target.value);
  });

  const saveButton = document.getElementById("save");
  saveButton.addEventListener("click", async () => {
    const selectedProjectId = projectDropdown.value;
    const listDropdown = document.getElementById("lists");
    const selectedListId = listDropdown.value;

    await saveSettings(accessToken, selectedProjectId, selectedListId);
    const settings = await getSavedSettings();
    if (settings) {
      selectedProject.textContent = settings.selectedProjectTitle;
      selectedList.textContent = settings.selectedListTitle;
    }
  });

  const selectedProject = document.getElementById("selectedProject");
  const selectedList = document.getElementById("selectedList");

  const settings = await getSavedSettings();
  if (settings) {
    selectedProject.textContent = settings.selectedProjectTitle;
    selectedList.textContent = settings.selectedListTitle;
  }
}

async function getAccessToken() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("access_token", (data) => {
      if (data.access_token) {
        resolve(data.access_token);
      } else {
        reject("Access token not found in chrome.storage");
      }
    });
  });
}

async function fetchProjects(accessToken) {
  const response = await fetch("https://api.ora.pm/projects", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return await response.json();
}

async function refreshLists(accessToken, projectId) {
  const response = await fetch(
    `https://api.ora.pm/projects/${projectId}/lists`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const lists = await response.json();

  const listDropdown = document.getElementById("lists");
  listDropdown.innerHTML = "";
  lists.data.forEach((list) => {
    const option = document.createElement("option");
    option.textContent = list.title;
    option.value = list.id;
    listDropdown.appendChild(option);
  });
}

async function saveSettings(accessToken, projectId, listId) {
  const projectResponse = await fetch(
    `https://api.ora.pm/projects/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const project = await projectResponse.json();

  const listResponse = await fetch(
    `https://api.ora.pm/projects/${projectId}/lists/${listId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const list = await listResponse.json();

  const settings = {
    selectedProjectId: projectId,
    selectedProjectTitle: project.data.title,
    selectedListId: listId,
    selectedListTitle: list.list.title,
  };

  return new Promise((resolve, reject) => {
    chrome.storage.local.set(settings, () => {
      resolve();
    });
  });
}

async function getSavedSettings() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(
      [
        "selectedProjectId",
        "selectedProjectTitle",
        "selectedListId",
        "selectedListTitle",
      ],
      (data) => {
        if (
          data.selectedProjectId &&
          data.selectedProjectTitle &&
          data.selectedListId &&
          data.selectedListTitle
        ) {
          resolve(data);
        } else {
          resolve(null);
        }
      }
    );
  });
}

main();
