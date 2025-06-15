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
let jsonFolderPath

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

function ensureFoldersExist(basePath) {
  jsonFolderPath = path.join(basePath, 'jsons')
  if (!fs.existsSync(jsonFolderPath)) {
    fs.mkdirSync(jsonFolderPath, { recursive: true })
  }
}

function getFilePaths() {
  return {
    teamsFilePath: path.join(jsonFolderPath, 'Brackets.json'),
    playersFilePath: path.join(jsonFolderPath, 'Players Stats.json'),
    matchesFilePath: path.join(jsonFolderPath, "Today's Matches.json"),
  }
}

function appendToLog(message) {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`
  fs.appendFileSync(logFilePath, logMessage)
}

// Initialize file system structure
ensureFoldersExist(customSavePath)
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
ipcMain.handle('get-default-save-path', () => customSavePath)

ipcMain.handle('set-custom-save-path', async (_event, newPath) => {
  try {
    newPath = newPath?.trim() ? newPath : app.getPath('userData')

    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath, { recursive: true })
    }

    store.set('customSavePath', newPath)
    customSavePath = newPath
    ensureFoldersExist(customSavePath)
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
ipcMain.handle('load-teams-cache', () => store.get('teamsCache'))
ipcMain.handle('save-teams-cache', (_event, data) => {
  store.set('teamsCache', JSON.parse(data))
  return true
})

ipcMain.handle('save-teams', async (_event, data) => {
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
ipcMain.handle('load-player-cache', () => store.get('playerCache'))
ipcMain.handle('save-player-cache', (_event, data) => {
  store.set('playerCache', JSON.parse(data))
  return true
})

ipcMain.handle('save-player', async (_event, data) => {
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
ipcMain.handle('load-matches-cache', () => store.get('matchesCache'))
ipcMain.handle('save-matches-cache', (_event, data) => {
  store.set('matchesCache', JSON.parse(data))
  return true
})

ipcMain.handle('save-matches', async (_event, data) => {
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
ipcMain.handle('save-settings-cache', async (_event, data) => {
  try {
    store.set('settingsCache', data)
    return true
  } catch (error) {
    console.error('Error saving settings:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('get-settings-cache', async () => store.get('settingsCache'))

ipcMain.handle('set-last-preset', (_, name) => {
  store.set('lastAppliedPreset', name)
  return true
})

ipcMain.handle('get-last-preset', () => store.get('lastAppliedPreset', ''))

ipcMain.handle('get-presets', async () => store.get('presets', {}))

ipcMain.handle('save-preset', async (_, { name, views }) => {
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

ipcMain.handle('delete-preset', async (_, name) => {
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

ipcMain.handle('rename-preset', async (_, oldName, newName) => {
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

// ======================
// IPC Handlers - File Dialogs
// ======================
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  return result.canceled ? null : result.filePaths[0]
})

ipcMain.handle('dialog:openFile', async (_, options) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: options.filters
  })
  return result
})

ipcMain.handle('file:read', async (_, path) => {
  return fs.promises.readFile(path)
})

ipcMain.on('dialog:error', (_, message) => {
  dialog.showErrorBox('Error', message)
})

// ======================
// IPC Handlers - App Management
// ======================
ipcMain.handle('clear-data-cache', async () => {
  try {
    ['teamsCache', 'playerCache', 'matchesCache', 'settingsCache', 'customSavePath']
      .forEach(key => store.delete(key))
    return { success: true }
  } catch (error) {
    console.error('Error clearing cache:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('get-app-version', () => app.getVersion())

// ======================
// Auto Update Functionality
// ======================
autoUpdater.autoDownload = false

// Update event handlers
autoUpdater.on('update-available', () => {
  mainWindow?.webContents?.send('update_available') ||
    console.error('Update check error: mainWindow is not ready')
})

autoUpdater.on('update-not-available', () => {
  mainWindow?.webContents?.send('update_not_available') ||
    console.error('Update check error: mainWindow is not ready')
})

autoUpdater.on('update-downloaded', () => {
  mainWindow?.webContents?.send('update_downloaded') ||
    console.error('Update check error: mainWindow is not ready')
})

autoUpdater.on('download-progress', (progressObj) => {
  mainWindow?.webContents?.send('update-download-progress', Math.round(progressObj.percent))
})

// Update IPC handlers
ipcMain.handle('check-for-update', async () => {
  try {
    await autoUpdater.checkForUpdates()
  } catch (err) {
    console.error('Error checking for update:', err)
    return { error: err.message }
  }
})

ipcMain.handle('download-update', async () => {
  try {
    await autoUpdater.downloadUpdate()
  } catch (err) {
    console.error('Error downloading update:', err)
    return { error: err.message }
  }
})

ipcMain.on('quit-and-install', () => autoUpdater.quitAndInstall())

// ======================
// Error Handling
// ======================
ipcMain.on('log-error', (_event, message) => appendToLog(message))

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
