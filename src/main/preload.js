/* eslint-disable no-undef */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {

  loadTeamsCache: () => ipcRenderer.invoke('load-teams-cache'),

  saveTeamsCache: (data) => ipcRenderer.invoke('save-teams-cache', data),

  saveTeams: (data) => ipcRenderer.invoke('save-teams', data),
  // loadTeams: () => ipcRenderer.invoke('load-teams'),


  loadPlayerCache: () => ipcRenderer.invoke('load-player-cache'),

  savePlayerCache: (data) => ipcRenderer.invoke('save-player-cache', data),


  savePlayer: (data) => ipcRenderer.invoke('save-player', data),
  // loadPlayer: () => ipcRenderer.invoke('load-player'),


  loadMatchesCache: () => ipcRenderer.invoke('load-matches-cache'),

  saveMatchesCache: (data) => ipcRenderer.invoke('save-matches-cache', data),

  saveMatches: (data) => ipcRenderer.invoke('save-matches', data),
  // loadMatches: () => ipcRenderer.invoke('load-matches'),

  saveViewSettingsCache: (data) => ipcRenderer.invoke('save-settings-cache', data),
  getViewSettingsCache: () => ipcRenderer.invoke('get-settings-cache'),
  clearDataCache: () => ipcRenderer.invoke('clear-data-cache'),
  // saveViewSettings: (data) => ipcRenderer.invoke('save-settings', data),
  // getViewSettings: () => ipcRenderer.invoke('get-settings'),
  // clearDataFile: () => ipcRenderer.invoke('clear-data'),


  setCustomSavePath: (customPath) => ipcRenderer.invoke('set-custom-save-path', customPath),



logError: (message) => ipcRenderer.send('log-error', message),



})



