document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (code) {
    chrome.storage.local.get(["clientId", "clientSecret"], function (data) {
      const clientId = data.clientId;
      const clientSecret = data.clientSecret;

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
            console.log(data);
            chrome.storage.local.set(
              { access_token: data.access_token },
              function () {
                console.log("Token saved to chrome.storage");
              }
            );

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
