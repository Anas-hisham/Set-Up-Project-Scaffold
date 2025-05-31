/* eslint-disable no-undef */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {

  loadTeamsCache: () => ipcRenderer.invoke('load-teams-cache'),
  saveTeamsCache: (data) => ipcRenderer.invoke('save-teams-cache', data),
  saveTeams: (data) => ipcRenderer.invoke('save-teams', data),

  loadPlayerCache: () => ipcRenderer.invoke('load-player-cache'),
  savePlayerCache: (data) => ipcRenderer.invoke('save-player-cache', data),
  savePlayer: (data) => ipcRenderer.invoke('save-player', data),

  loadMatchesCache: () => ipcRenderer.invoke('load-matches-cache'),
  saveMatchesCache: (data) => ipcRenderer.invoke('save-matches-cache', data),
  saveMatches: (data) => ipcRenderer.invoke('save-matches', data),

  saveViewSettingsCache: (data) => ipcRenderer.invoke('save-settings-cache', data),
  getViewSettingsCache: () => ipcRenderer.invoke('get-settings-cache'),
  clearDataCache: () => ipcRenderer.invoke('clear-data-cache'),


  setCustomSavePath: (customPath) => ipcRenderer.invoke('set-custom-save-path', customPath),


  logError: (message) => ipcRenderer.send('log-error', message),


  savePreset: (name, views) => ipcRenderer.invoke('save-preset', { name, views }),
  getPresets: () => ipcRenderer.invoke('get-presets'),
  deletePreset: (name) => ipcRenderer.invoke('delete-preset', name),
  renamePreset: (oldName, newName) => ipcRenderer.invoke('rename-preset', oldName, newName),

})



