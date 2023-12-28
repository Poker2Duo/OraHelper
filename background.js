// Register a service worker.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

// Listen for messages from the content script.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "addToOra") {
    // Your code to send data to Ora.pm
  }
});
