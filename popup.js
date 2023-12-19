document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("authorizationForm");
  const clientIdInput = document.getElementById("clientId");
  const clientSecretInput = document.getElementById("clientSecret");

  chrome.storage.local.get(["clientId", "clientSecret"], function (data) {
    clientIdInput.value = data.clientId || "";
    clientSecretInput.value = data.clientSecret || "";
  });

  clientIdInput.addEventListener("input", saveDataToStorage);
  clientSecretInput.addEventListener("input", saveDataToStorage);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const clientId = clientIdInput.value;
    const clientSecret = clientSecretInput.value;

    chrome.storage.local.set(
      {
        clientId: clientId,
        clientSecret: clientSecret,
      },
      function () {
        const authorizeUrl = `https://app.ora.pm/authorize?response_type=code&client_id=${clientId}&redirect_uri=chrome-extension://jfofphgfbmedpjhgjcgnjjnkdgkkfhok/oauth2callback.html`;
        chrome.tabs.create({ url: authorizeUrl });
      }
    );
  });

  function saveDataToStorage() {
    chrome.storage.local.set(
      {
        clientId: clientIdInput.value,
        clientSecret: clientSecretInput.value,
      },
      function () {
        console.log("Data saved to chrome.storage");
      }
    );
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const settingsButton = document.getElementById("settingsButton");

  // Проверка наличия токена при загрузке popup
  chrome.storage.local.get("access_token", function (data) {
    const accessToken = data.access_token;

    if (accessToken) {
      settingsButton.style.display = "block";
    } else {
      settingsButton.style.display = "none";
    }
  });

  // Добавление обработчика для кнопки настроек
  settingsButton.addEventListener("click", function () {
    // Переход на страницу настроек
    chrome.tabs.create({ url: "settings.html" });
  });
});
