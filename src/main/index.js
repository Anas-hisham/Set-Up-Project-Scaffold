import { app, ipcMain } from 'electron'
import path from 'path'
import Store from 'electron-store'
import pkg from 'electron-updater'
import { createWindow } from './windowManager.js'
import { setupIpcHandlers } from './handlers/index.js'
import { ensureLogExist, appendToLog } from './utils/fileManager.js'
import { setupAutoUpdaterHandlers } from './utils/autoUpdaterHandlers.js'

// ======================
// Constants & Initial Setup
// ======================
const { autoUpdater } = pkg
const store = new Store()


// ======================
// Global Variables (Managed in Main Process)
// ======================
let mainWindow = null // To hold the reference to the main window

// customSavePath is initialized from store or app's userData path
let customSavePath = store.get('customSavePath') || app.getPath('userData')
let logFilePath = path.join(customSavePath, 'errors.log')

// ======================
// Global Accessors for Shared State
// ======================

//  Returns the current main window instance.

const getMainWindow = () => mainWindow

//  Updates the customSavePath in the main process and recalculates logFilePath.
const setCustomSavePathGlobal = (newPath) => {
  newPath = newPath?.trim() || app.getPath('userData') // Ensure we always have a valid path
  customSavePath = newPath
  logFilePath = path.join(customSavePath, 'errors.log')
  store.set('customSavePath', newPath) // Explicitly update the store
  ensureLogExist(customSavePath)

}

// Returns the current customSavePath.

const getCustomSavePathGlobal = () => customSavePath


// Returns the current logFilePath.

const getLogFilePathGlobal = () => logFilePath

// Initialize file system structure for the current path
ensureLogExist(customSavePath)

// ======================
// IPC & Auto-Update Setup
// ======================

// Register IPC handlers
setupIpcHandlers(store, getMainWindow, setCustomSavePathGlobal, getCustomSavePathGlobal, getLogFilePathGlobal)

// Register auto-updater related event handlers
setupAutoUpdaterHandlers(autoUpdater, getMainWindow, appendToLog, getLogFilePathGlobal)


// ======================
// Global Error Handlers
// ======================
// Log errors sent from renderer process
ipcMain.on('logError', (_event, message) => appendToLog(message, getLogFilePathGlobal()))

// Catch and log uncaught exceptions in the main process
process.on('uncaughtException', (err) => {
  appendToLog(`Uncaught Exception: ${err.stack || err.message}`, getLogFilePathGlobal())
})

// Catch and log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  appendToLog(`Unhandled Rejection: ${reason}\nPromise: ${promise}`, getLogFilePathGlobal())
})

// ======================
// Application Lifecycle
// ======================
app.whenReady()
  .then(() => {
    console.log('App is ready')
    mainWindow = createWindow()
    // Reset mainWindow reference on close
    mainWindow.on('closed', () => {
      mainWindow = null
    })
  })
  .catch((error) => {
    console.error('Error during app start:', error)
    appendToLog(`Error during app start: ${error.stack || error.message}`, getLogFilePathGlobal())
  })

// Quit the application when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Re-create window on macOS when dock icon is clicked and no windows are open
app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createWindow()
    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }
})

