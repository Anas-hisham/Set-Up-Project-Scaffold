/* eslint-disable no-undef */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  saveTeams: (data) => ipcRenderer.invoke('save-teams', data),
  loadTeams: () => ipcRenderer.invoke('load-teams'),

  savePlayer: (data) => ipcRenderer.invoke('save-player', data),
  loadPlayer: () => ipcRenderer.invoke('load-player'),

  saveMatches: (data) => ipcRenderer.invoke('save-matches', data),
  loadMatches: () => ipcRenderer.invoke('load-matches'),


  saveViewSettings: (data) => ipcRenderer.invoke('save-settings', data),
  getViewSettings: () => ipcRenderer.invoke('get-settings'),
})

