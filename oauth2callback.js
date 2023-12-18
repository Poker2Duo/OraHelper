document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (code) {
    // Получаем client_id и client_secret из хранилища расширения
    chrome.storage.local.get(["client_id", "client_secret"], function (data) {
      const clientId = data.client_id;
      const clientSecret = data.client_secret;

      // Проверяем, есть ли сохраненные client_id и client_secret
      if (clientId && clientSecret) {
        const redirectUri =
          "chrome-extension://jfofphgfbmedpjhgjcgnjjnkdgkkfhok/oauth2callback.html";
        const tokenUrl = "https://api.ora.pm/oauth/token";
        const body = {
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        };

        fetch(tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })
          .then((response) => response.json())
          .then((data) => {
            // Обработка полученного токена
            console.log(data);
            // Сохранение токена в хранилище расширения
            chrome.storage.local.set(
              { access_token: data.access_token },
              function () {
                console.log("Token saved to chrome.storage");
              }
            );

            // Закрытие вкладки после получения токена
            window.close();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        console.error("Client ID or Client Secret not found");
      }
    });
  }
});
