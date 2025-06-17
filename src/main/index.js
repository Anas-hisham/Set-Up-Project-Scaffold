/* eslint-disable no-undef */
import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import Store from 'electron-store'
import pkg from 'electron-updater'

// ======================
// Constants & Initial Setup
// ======================
const { autoUpdater } = pkg
const store = new Store()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ======================
// Global Variables
// ======================
let mainWindow
let customSavePath = store.get('customSavePath') || app.getPath('userData')

// ======================
// Path Configuration
// ======================
const logFilePath = path.join(customSavePath, 'errors.log')

// ======================
// File System Utilities
// ======================
function ensureLogExist(folderPath) {
  const logFile = path.join(folderPath, 'errors.log')
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '')
  }
}

function getFilePaths() {
  return {
    teamsFilePath: path.join(customSavePath, 'Brackets.json'),
    playersFilePath: path.join(customSavePath, 'Players Stats.json'),
    matchesFilePath: path.join(customSavePath, "Today's Matches.json"),
  }
}

function appendToLog(message) {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`
  fs.appendFileSync(logFilePath, logMessage)
}

// Initialize file system structure
ensureLogExist(customSavePath)

// ======================
// Window Management
// ======================
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
    },
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'))
  }
}

// ======================
// IPC Handlers - Path Management
// ======================
ipcMain.handle('getDefaultSavePath', () => customSavePath)

ipcMain.handle('setCustomSavePath', async (_event, newPath) => {
  try {
    newPath = newPath?.trim() ? newPath : app.getPath('userData')

    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath, { recursive: true })
    }

    store.set('customSavePath', newPath)
    customSavePath = newPath
    ensureLogExist(customSavePath)

    return { success: true }
  } catch (error) {
    console.error('Error setting custom save path:', error)
    return { success: false, error: error.message }
  }
})

// ======================
// IPC Handlers - Data Persistence
// ======================

// Teams Data
ipcMain.handle('loadTeamsCache', () => store.get('teamsCache'))
ipcMain.handle('saveTeamsCache', (_event, data) => {
  store.set('teamsCache', JSON.parse(data))
  return true
})

ipcMain.handle('saveTeams', async (_event, data) => {
  try {
    const { teamsFilePath } = getFilePaths()
    fs.writeFileSync(teamsFilePath, JSON.stringify(JSON.parse(data), null, 2), 'utf-8')
    return { success: true }
  } catch (error) {
    console.error('Error saving teams:', error)
    return { success: false, error: error.message }
  }
})

// Players Data
ipcMain.handle('loadPlayerCache', () => store.get('playerCache'))
ipcMain.handle('savePlayerCache', (_event, data) => {
  store.set('playerCache', JSON.parse(data))
  return true
})

ipcMain.handle('savePlayer', async (_event, data) => {
  try {
    const { playersFilePath } = getFilePaths()
    fs.writeFileSync(playersFilePath, JSON.stringify(JSON.parse(data), null, 2), 'utf-8')
    return { success: true }
  } catch (error) {
    console.error('Error saving players:', error)
    return { success: false, error: error.message }
  }
})

// Matches Data
ipcMain.handle('loadMatchesCache', () => store.get('matchesCache'))
ipcMain.handle('saveMatchesCache', (_event, data) => {
  store.set('matchesCache', JSON.parse(data))
  return true
})

ipcMain.handle('saveMatches', async (_event, data) => {
  try {
    const { matchesFilePath } = getFilePaths()
    const parsed = JSON.parse(data)
    const processedMatches = parsed.matches.map(matchObj => {
      const matchKey = Object.keys(matchObj)[0]
      return { [matchKey]: matchObj[matchKey] }
    })

    fs.writeFileSync(
      matchesFilePath,
      JSON.stringify({ info: parsed.info, matches: processedMatches }, null, 2),
      'utf-8'
    )
    return { success: true }
  } catch (error) {
    console.error('Error saving matches:', error)
    return { success: false, error: error.message }
  }
})

// ======================
// IPC Handlers - Settings & Presets
// ======================
ipcMain.handle('saveSettingsCache', async (_event, data) => {
  try {
    store.set('settingsCache', data)
    return true
  } catch (error) {
    console.error('Error saving settings:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('getSettingsCache', async () => store.get('settingsCache'))

ipcMain.handle('setLastPreset', (_, name) => {
  store.set('lastAppliedPreset', name)
  return true
})

ipcMain.handle('getLastPreset', () => store.get('lastAppliedPreset', ''))

ipcMain.handle('getPresets', async () => store.get('presets', {}))

ipcMain.handle('savePreset', async (_, { name, views }) => {
  try {
    const presets = store.get('presets', {})
    presets[name] = views
    store.set('presets', presets)
    return true
  } catch (error) {
    console.error('Error saving preset:', error)
    return false
  }
})

ipcMain.handle('deletePreset', async (_, name) => {
  try {
    const presets = store.get('presets', {})
    delete presets[name]
    store.set('presets', presets)
    return true
  } catch (error) {
    console.error('Error deleting preset:', error)
    return false
  }
})

ipcMain.handle('renamePreset', async (_, oldName, newName) => {
  try {
    const presets = store.get('presets', {})
    if (presets[oldName]) {
      const newPresets = {}
      for (const [key, value] of Object.entries(presets)) {
        newPresets[key === oldName ? newName : key] = value
      }
      store.set('presets', newPresets)
    }
    return true
  } catch (err) {
    console.error('Error renaming preset:', err)
    return false
  }
})

ipcMain.handle('clearAllViewPresets', async () => {
  try {
    store.delete('lastAppliedPreset')
    return true
  } catch (err) {
    console.error('Failed to clear presets:', err)
    return false
  }
})


// ======================
// IPC Handlers - File Dialogs
// ======================
ipcMain.handle('selectFolder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  return result.canceled ? null : result.filePaths[0]
})

ipcMain.handle('dialogOpenFile', async (_, options) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: options.filters
  })
  return result
})

ipcMain.handle('fileRead', async (_, path) => {
  return fs.promises.readFile(path)
})

ipcMain.on('dialogError', (_, message) => {
  dialog.showErrorBox('Error', message)
})

// ======================
// IPC Handlers - App Management
// ======================
ipcMain.handle('clearDataCache', async () => {
  try {
    ['teamsCache', 'playerCache', 'matchesCache', 'settingsCache', 'customSavePath']
      .forEach(key => store.delete(key))
    return { success: true }
  } catch (error) {
    console.error('Error clearing cache:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('getAppVersion', () => app.getVersion())

// ======================
// Auto Update Functionality
// ======================
autoUpdater.autoDownload = false

// Update event handlers
autoUpdater.on('update-available', (info) => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    console.error('Update check error: mainWindow is not ready');
    return;
  }

  mainWindow.webContents.send('updateAvailable', {
    version: info.version || info.releaseName
  });
});

autoUpdater.on('update-not-available', () => {
  mainWindow?.webContents?.send('updateNotAvailable') ||
    console.error('Update check error: mainWindow is not ready')
})

autoUpdater.on('update-downloaded', () => {
  mainWindow?.webContents?.send('updateDownloaded') ||
    console.error('Update check error: mainWindow is not ready')
})

autoUpdater.on('download-progress', (progressObj) => {
  mainWindow?.webContents?.send('updateDownloadProgress', Math.round(progressObj.percent))
})

// Update IPC handlers
ipcMain.handle('checkForUpdate', async () => {
  try {
    await autoUpdater.checkForUpdates()
  } catch (err) {
    console.error('Error checking for update:', err)
    return { error: err.message }
  }
})

ipcMain.handle('downloadUpdate', async () => {
  try {
    await autoUpdater.downloadUpdate()
  } catch (err) {
    console.error('Error downloading update:', err)
    return { error: err.message }
  }
})

ipcMain.on('quitAndInstall', () => autoUpdater.quitAndInstall())

// ======================
// Error Handling
// ======================
ipcMain.on('logError', (_event, message) => appendToLog(message))

process.on('uncaughtException', (err) => {
  appendToLog(`Uncaught Exception: ${err.stack || err.message}`)
})

process.on('unhandledRejection', (reason) => {
  appendToLog(`Unhandled Rejection: ${reason}`)
})

// ======================
// App Lifecycle
// ======================
app.whenReady()
  .then(() => {
    console.log('App is ready')
    createWindow()
  })
  .catch((error) => {
    console.error('Error during app start:', error)
  })
