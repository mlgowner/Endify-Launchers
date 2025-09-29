const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  login: (data) => ipcRenderer.invoke('login', data),
  fetchProfile: () => ipcRenderer.invoke('fetch-profile'),
  fetchVersions: () => ipcRenderer.invoke('fetch-versions'),
  installVersion: (versionId) => ipcRenderer.invoke('install-version', versionId),
  launchMc: (data) => ipcRenderer.invoke('launch-mc', data),
  installMod: (modId) => ipcRenderer.invoke('install-mod', modId),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  openRegister: () => ipcRenderer.invoke('open-register'),
  switchToMain: () => ipcRenderer.invoke('switch-to-main')
});