// Listen for changes to the toggle state
browser.storage.onChanged.addListener((changes) => {
  if (changes.gpcEnabled) {
    gpcEnabled = changes.gpcEnabled.newValue;
  }
});

// Fetch the initial toggle state on startup
let gpcEnabled = true;
browser.storage.local.get('gpcEnabled').then((result) => {
  gpcEnabled = result.gpcEnabled ?? true;
});

browser.webRequest.onBeforeSendHeaders.addListener(
  async function(details) {
    if (!gpcEnabled) {
      return {}; // Skip setting the header if GPC is disabled
    }

    // Check if the Sec-GPC header is already present
    const headerExists = details.requestHeaders.some(
      (header) => header.name.toLowerCase() === "sec-gpc"
    );

    if (!headerExists) {
      details.requestHeaders.push({
        name: "Sec-GPC",
        value: "1"
      });

      // Log the URL to storage
      let { gpcLogs } = await browser.storage.local.get('gpcLogs');
      gpcLogs = gpcLogs || [];
      gpcLogs.push({
        url: details.url,
        timestamp: new Date().toISOString()
      });
      // Store the updated log
      browser.storage.local.set({ gpcLogs });
    }

    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);
