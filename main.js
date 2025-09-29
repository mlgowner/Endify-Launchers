const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const axios = require('axios');
const { minecraftAuth } = require('minecraft-auth');

let win;

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });
  win.loadFile(path.join(__dirname, 'pages/main.html')); // Updated path
});

ipcMain.handle('login', async (event, data) => {
  if (data.username === 'Mlg' && data.password === '09012001') {
    const profile = { username: data.username, uuid: 'admin-uuid', isAdmin: 1 };
    fs.writeFileSync('endify.json', JSON.stringify(profile));
    return { success: true, user: profile };
  }
  try {
    const auth = await minecraftAuth.loginMicrosoft(data.username, data.password);
    const profile = { username: data.username, uuid: auth.uuid, isAdmin: 0 };
    fs.writeFileSync('endify.json', JSON.stringify(profile));
    return { success: true, user: profile };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fetch-profile', () => {
  try {
    return JSON.parse(fs.readFileSync('endify.json', 'utf8'));
  } catch (error) {
    return {};
  }
});

ipcMain.handle('fetch-versions', async () => {
  try {
    const response = await axios.get('https://launchermeta.mojang.com/mc/game/version_manifest.json');
    return response.data.versions;
  } catch (error) {
    return [];
  }
});

ipcMain.handle('install-version', async (event, versionId) => {
  try {
    const response = await axios.get(`https://piston-meta.mojang.com/v1/packages/.../${versionId}.json`); // Замени URL
    const jarUrl = response.data.downloads.client.url;
    const data = await axios.get(jarUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(`.minecraft/versions/${versionId}.jar`, data.data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('launch-mc', async (event, data) => {
  const args = [
    `-Xmx${require('./config.json').ram || '2'}G`,
    '-jar', `.minecraft/versions/${data.version}.jar`,
    '--username', data.username,
    '--uuid', data.uuid
  ];
  spawn('java', args, { stdio: 'inherit' });
  return { success: true };
});

ipcMain.handle('install-mod', async (event, modId) => {
  try {
    const response = await axios.get(`https://api.modrinth.com/v2/project/${modId}/version`, { responseType: 'arraybuffer' });
    fs.writeFileSync(`.minecraft/mods/${modId}.jar`, response.data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-settings', async (event, settings) => {
  fs.writeFileSync('config.json', JSON.stringify(settings));
  return { success: true };
});

ipcMain.handle('open-register', () => {
  shell.openExternal('https://yourwebsite.com/register');
  return { success: true };
});

ipcMain.handle('switch-to-main', () => {
  win.webContents.send('switch-to-main');
  return { success: true };
});