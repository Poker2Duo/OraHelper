document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("authorizationForm");
  const clientIdInput = document.getElementById("clientId");
  const clientSecretInput = document.getElementById("clientSecret");
  // ... остальные элементы формы, если есть

  // Получение сохраненных значений из хранилища
  chrome.storage.sync.get(["clientId", "clientSecret"], function (data) {
    clientIdInput.value = data.clientId || "";
    clientSecretInput.value = data.clientSecret || "";
    // ... остальные сохраненные данные, если есть
  });

  // Функция сохранения данных при внесении изменений в инпуты
  clientIdInput.addEventListener("input", saveDataToStorage);
  clientSecretInput.addEventListener("input", saveDataToStorage);
  // ... обработчики других инпутов

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Form submitted");

    // Отправка запроса на авторизацию
    const clientId = clientIdInput.value;
    const clientSecret = clientSecretInput.value;
    // ... остальные данные формы
    const authorizeUrl = `https://app.ora.pm/authorize?response_type=code&client_id=${clientId}&redirect_uri=chrome-extension://jfofphgfbmedpjhgjcgnjjnkdgkkfhok/oauth2callback.html`;
    chrome.tabs.create({ url: authorizeUrl });
    // Здесь нужно отправить запрос на авторизацию
    // Используйте fetch или другие методы для отправки данных на сервер
    // ...
  });

  // Функция сохранения данных в хранилище
  function saveDataToStorage() {
    chrome.storage.sync.set(
      {
        clientId: clientIdInput.value,
        clientSecret: clientSecretInput.value,
        // ... другие сохраняемые данные
      },
      function () {
        console.log("Data saved to chrome.storage");
      }
    );
  }
});
