import { ipcMain, dialog, app } from 'electron'
import fs from 'fs'
import { appendToLog } from '../utils/fileManager.js'

function setupPathHandlers(setCustomSavePathGlobal, getCustomSavePathGlobal, getLogFilePathGlobal) {
  // Handles requests for the default save path.
  // The 'default' path here refers to the application's current custom save path,
  // which could be the user data path or a user-defined path.
  ipcMain.handle('getDefaultSavePath', () => {
    return getCustomSavePathGlobal()
  })

  // Handles setting a custom save path for the application.
  // It updates the path in both Electron-store and the main process's global state.
  ipcMain.handle('setCustomSavePath', async (_event, newPath) => {
    try {
      newPath = newPath?.trim() ? newPath : app.getPath('userData')

      if (!fs.existsSync(newPath)) {
        fs.mkdirSync(newPath, { recursive: true })
      }

      setCustomSavePathGlobal(newPath)

      return { success: true }
    } catch (error) {
      console.error('Error setting custom save path:', error)
      appendToLog(`Error setting custom save path: ${error.message}`, getLogFilePathGlobal())
      return { success: false, error: error.message }
    }
  })

  // Opens a native folder selection dialog and returns the selected path.
  ipcMain.handle('selectFolder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'] // Configure dialog to allow only directory selection.
    })
    // If the user cancels the dialog, result.canceled will be true.
    // Otherwise, return the first selected path (since 'openDirectory' allows only one).
    return result.canceled ? null : result.filePaths[0]
  })
}

export {
  setupPathHandlers
}
