const { contextBridge, ipcRenderer } = require('electron');

console.log('test');

ipcRenderer.on('getLatestVideos', (event, arg) => {
    document.querySelectorAll("div.style-scope.ytd-rich-grid-renderer div a").forEach(a => {
        if(a.getAttribute("href").includes("/watch?v=")) {
            console.log(a.getAttribute("href").replace("/watch?v=", "").split("&")[0]);
        }
    });
});