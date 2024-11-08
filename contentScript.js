// Listen for changes to the toggle state
browser.storage.onChanged.addListener((changes) => {
  if (changes.gpcEnabled) {
    setGPCSignal(changes.gpcEnabled.newValue);
  }
});

// Function to set or remove the GPC signal based on toggle state
function setGPCSignal(enabled) {
  if (enabled) {
    // Inject script to set navigator.globalPrivacyControl to true
    const script = document.createElement('script');
    script.textContent = `
      (function() {
        try {
          Object.defineProperty(navigator, 'globalPrivacyControl', {
            get: function() {
              return true;
            },
            configurable: true
          });
          console.log('navigator.globalPrivacyControl is now set to true.');
        } catch (e) {
          console.error('Failed to set navigator.globalPrivacyControl:', e);
        }
      })();
    `;
    document.documentElement.appendChild(script);
    script.remove(); // Remove the script element after injection
  } else {
    // Remove the GPC signal if previously set
    const resetScript = document.createElement('script');
    resetScript.textContent = `
      (function() {
        try {
          Object.defineProperty(navigator, 'globalPrivacyControl', {
            get: function() {
              return undefined;
            },
            configurable: true
          });
          console.log('navigator.globalPrivacyControl is now set to undefined.');
        } catch (e) {
          console.error('Failed to reset navigator.globalPrivacyControl:', e);
        }
      })();
    `;
    document.documentElement.appendChild(resetScript);
    resetScript.remove(); // Remove the script element after injection
  }
}

// Initialize the GPC signal based on the current toggle state
browser.storage.local.get('gpcEnabled').then((result) => {
  setGPCSignal(result.gpcEnabled ?? true); // Default to true if not set
});
