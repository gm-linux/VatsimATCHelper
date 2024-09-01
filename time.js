function updateTime() {
    const now = new Date();

    // Local time
    const localTime = now.toLocaleTimeString();
    document.getElementById('local-time').innerText = localTime;

    // Zulu time (UTC)
    const zuluTime = now.toUTCString().split(' ')[4];  // Extract the time part
    document.getElementById('zulu-time').innerText = zuluTime;

    const currentDate = now.toLocaleDateString();
    document.getElementById('current-date').innerText = currentDate;
}

// Initialize time display
updateTime();
