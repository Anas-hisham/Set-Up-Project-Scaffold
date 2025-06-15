/* eslint-disable no-undef */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {

  // ────────────────────────────────
  // Teams APIs
  // ────────────────────────────────
  loadTeamsCache: () => ipcRenderer.invoke('load-teams-cache'),
  saveTeamsCache: (data) => ipcRenderer.invoke('save-teams-cache', data),
  saveTeams: (data) => ipcRenderer.invoke('save-teams', data),

  // ────────────────────────────────
  // Players APIs
  // ────────────────────────────────
  loadPlayerCache: () => ipcRenderer.invoke('load-player-cache'),
  savePlayerCache: (data) => ipcRenderer.invoke('save-player-cache', data),
  savePlayer: (data) => ipcRenderer.invoke('save-player', data),

  // ────────────────────────────────
  // Matches APIs
  // ────────────────────────────────
  loadMatchesCache: () => ipcRenderer.invoke('load-matches-cache'),
  saveMatchesCache: (data) => ipcRenderer.invoke('save-matches-cache', data),
  saveMatches: (data) => ipcRenderer.invoke('save-matches', data),

  // ────────────────────────────────
  // Presets & Settings
  // ────────────────────────────────
  setLastAppliedPreset: (name) => ipcRenderer.invoke('set-last-preset', name),
  getLastAppliedPreset: () => ipcRenderer.invoke('get-last-preset'),
  saveViewSettingsCache: (data) => ipcRenderer.invoke('save-settings-cache', data),
  getViewSettingsCache: () => ipcRenderer.invoke('get-settings-cache'),
  clearDataCache: () => ipcRenderer.invoke('clear-data-cache'),

  setCustomSavePath: (customPath) => ipcRenderer.invoke('set-custom-save-path', customPath),

  // ────────────────────────────────
  // Logging & Errors
  // ────────────────────────────────
  logError: (message) => ipcRenderer.send('log-error', message),
  showErrorDialog: (message) => ipcRenderer.send('dialog:error', message),

  // ────────────────────────────────
  // Presets Management
  // ────────────────────────────────
  savePreset: (name, views) => ipcRenderer.invoke('save-preset', { name, views }),
  getPresets: () => ipcRenderer.invoke('get-presets'),
  deletePreset: (name) => ipcRenderer.invoke('delete-preset', name),
  renamePreset: (oldName, newName) => ipcRenderer.invoke('rename-preset', oldName, newName),

  // ────────────────────────────────
  // App Version & Updates
  // ────────────────────────────────
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  checkForUpdate: () => ipcRenderer.invoke('check-for-update'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.send('quit-and-install'),

  onUpdateAvailable: (callback) => ipcRenderer.on('update_available', callback),
  onUpdateNotAvailable: (callback) => ipcRenderer.on('update_not_available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update_downloaded', callback),
  onDownloadProgress: (callback) =>
    ipcRenderer.on('update-download-progress', (event, percent) => callback(percent)),

  // ────────────────────────────────
  // Paths & File System
  // ────────────────────────────────
  getDefaultSavePath: () => ipcRenderer.invoke('get-default-save-path'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  openFileDialog: (options) => ipcRenderer.invoke('dialog:openFile', options),
  readFile: (path) => ipcRenderer.invoke('file:read', path)

})
