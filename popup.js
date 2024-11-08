document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('gpcToggle');
    const logList = document.getElementById('logList');
    const clearLogsButton = document.getElementById('clearLogs');
  
    // Load the toggle state from storage
    browser.storage.local.get('gpcEnabled').then((result) => {
      toggle.checked = result.gpcEnabled ?? true;
    });
  
    // Save the new state when the toggle changes
    toggle.addEventListener('change', () => {
      browser.storage.local.set({ gpcEnabled: toggle.checked });
    });
  
    // Load and display logs
    function displayLogs() {
      logList.innerHTML = ''; // Clear existing logs
      browser.storage.local.get('gpcLogs').then((result) => {
        const logs = result.gpcLogs || [];
        if (logs.length === 0) {
          logList.innerHTML = '<p style="color: #aaa; text-align: center;">No logs available</p>';
        } else {
          logs.forEach(log => {
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            logItem.textContent = `${log.timestamp}: ${log.url}`;
            logList.appendChild(logItem);
          });
        }
      });
    }
  
    // Clear logs when the button is clicked
    clearLogsButton.addEventListener('click', () => {
      browser.storage.local.set({ gpcLogs: [] }, displayLogs);
    });
  
    // Initial load of logs
    displayLogs();
  });
  