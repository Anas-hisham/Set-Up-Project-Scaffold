import { ipcMain, dialog, app } from 'electron'
import fs from 'fs'
import { appendToLog, getFilePaths } from '../utils/fileManager.js'
import { setupPathHandlers } from './ipcPathHandlers.js'
import { setupDataHandlers } from './ipcDataHandlers.js'
import { setupSettingsHandlers } from './ipcSettingsHandlers.js'
import { setupAppHandlers } from './ipcAppHandlers.js'

function setupIpcHandlers(store, getMainWindow, setCustomSavePathGlobal, getCustomSavePathGlobal, getLogFilePathGlobal) {

  // Path management handlers
  setupPathHandlers(setCustomSavePathGlobal, getCustomSavePathGlobal, getLogFilePathGlobal)

  // Data persistence handlers (teams, players, matches)
  setupDataHandlers(store, getCustomSavePathGlobal, getLogFilePathGlobal)

  // Settings and presets handlers
  setupSettingsHandlers(store, getLogFilePathGlobal)

  // General application and file dialog handlers
  setupAppHandlers(store, setCustomSavePathGlobal, getLogFilePathGlobal)

}

export {
  setupIpcHandlers,
}
