import { ipcMain, dialog } from 'electron'
import fs from 'fs'
import Store from 'electron-store'
import { app } from 'electron'
import path from 'path'

const store = new Store()
let customSavePath = store.get('customSavePath') || app.getPath('userData')

// File System Utilities
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
  fs.appendFileSync(path.join(customSavePath, 'errors.log'), logMessage)
}

export function registerIpcHandlers(mainWindow) {
  // ======================
  // Path Management Handlers
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
  // Data Persistence Handlers
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
  // Settings & Presets Handlers
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
  // File Dialog Handlers
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
    return fs.readFile(path)
  })

  ipcMain.on('dialogError', (_, message) => {
    dialog.showErrorBox('Error', message)
  })

  // ======================
  // App Management Handlers
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
  // Error Logging Handler
  // ======================
  ipcMain.on('logError', (_event, message) => {
    appendToLog(message)
  })
}
