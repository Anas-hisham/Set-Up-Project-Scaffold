import { ipcMain, dialog, app } from 'electron'
import fs from 'fs'
import { appendToLog } from '../utils/fileManager.js'

function setupAppHandlers(store, setCustomSavePathGlobal, getLogFilePathGlobal) {
  // Handles clearing all cached application data from electron-store.
  ipcMain.handle('clearDataCache', async () => {
    try {
      // List of keys to clear from the store.
      const keysToClear = ['teamsCache', 'playerCache', 'matchesCache']
      keysToClear.forEach(key => store.delete(key)) // Delete each specified key.

      // Reset the custom save path to the default application user data path.
      setCustomSavePathGlobal(app.getPath('userData'))

      return { success: true }
    } catch (error) {
      console.error('Error clearing cache:', error)
      appendToLog(`Error clearing cache: ${error.message}`, getLogFilePathGlobal())
      return { success: false, error: error.message }
    }
  })

  // Returns the current version of the application.
  ipcMain.handle('getAppVersion', () => app.getVersion())

  // Opens a native file selection dialog.
  // Options can include filters (e.g., for specific file types).
  ipcMain.handle('dialogOpenFile', async (_, options) => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'], // Allow opening only files.
      filters: options.filters // Apply provided file filters.
    })
    return result // Returns an object with 'canceled' and 'filePaths'.
  })

  // Reads the content of a file at the given path.
  // Returns the file content as a Buffer.
  ipcMain.handle('fileRead', async (_, path) => {
    try {
      return fs.promises.readFile(path) // Asynchronously read the file.
    } catch (error) {
      console.error(`Error reading file at ${path}:`, error)
      appendToLog(`Error reading file at ${path}: ${error.message}`, getLogFilePathGlobal())
      return null // Return null on error, or you could re-throw the error for renderer to handle.
    }
  })

  // Displays a native error dialog box.
  ipcMain.on('dialogError', (_, message) => {
    dialog.showErrorBox('Error', message) // Show a simple error box.
    appendToLog(`Dialog Error: ${message}`, getLogFilePathGlobal())
  })
}

export {
  setupAppHandlers
}
