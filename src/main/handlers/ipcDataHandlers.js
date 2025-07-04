import { ipcMain } from 'electron'
import fs from 'fs'
import { getFilePaths, appendToLog } from '../utils/fileManager.js'

function setupDataHandlers(store, getCustomSavePathGlobal, getLogFilePathGlobal) {

  // ======================
  // Teams Data Handlers
  // ======================

  ipcMain.handle('loadTeamsCache', () => {
    return store.get('teamsCache')
  })

  ipcMain.handle('saveTeamsCache', (_event, data) => {
    try {
      store.set('teamsCache', JSON.parse(data))
      return true
    } catch (error) {
      console.error('Error saving teams cache:', error)
      appendToLog(`Error saving teams cache: ${error.message}`, getLogFilePathGlobal())
      return false
    }
  })

  ipcMain.handle('saveTeams', async (_event, data) => {
    try {
      // Get the full file path for teams data based on the custom save path.
      const { teamsFilePath } = getFilePaths(getCustomSavePathGlobal())
      fs.writeFileSync(teamsFilePath, JSON.stringify(JSON.parse(data), null, 2), 'utf-8')
      return { success: true }
    } catch (error) {
      console.error('Error saving teams:', error)
      appendToLog(`Error saving teams: ${error.message}`, getLogFilePathGlobal())
      return { success: false, error: error.message }
    }
  })

  // ======================
  // Players Data Handlers
  // ======================

  ipcMain.handle('loadPlayerCache', () => {
    return store.get('playerCache')
  })

  ipcMain.handle('savePlayerCache', (_event, data) => {
    try {
      store.set('playerCache', JSON.parse(data))
      return true
    } catch (error) {
      console.error('Error saving player cache:', error)
      appendToLog(`Error saving player cache: ${error.message}`, getLogFilePathGlobal())
      return false
    }
  })

  ipcMain.handle('savePlayer', async (_event, data) => {
    try {
      // Get the full file path for players data.
      const { playersFilePath } = getFilePaths(getCustomSavePathGlobal())
      fs.writeFileSync(playersFilePath, JSON.stringify(JSON.parse(data), null, 2), 'utf-8')
      return { success: true }
    } catch (error) {
      console.error('Error saving players:', error)
      appendToLog(`Error saving players: ${error.message}`, getLogFilePathGlobal())
      return { success: false, error: error.message }
    }
  })

  // ======================
  // Matches Data Handlers
  // ======================

  ipcMain.handle('loadMatchesCache', () => {
    return store.get('matchesCache')
  })

  ipcMain.handle('saveMatchesCache', (_event, data) => {
    try {
      store.set('matchesCache', JSON.parse(data))
      return true
    } catch (error) {
      console.error('Error saving matches cache:', error)
      appendToLog(`Error saving matches cache: ${error.message}`, getLogFilePathGlobal())
      return false
    }
  })

  ipcMain.handle('saveMatches', async (_event, data) => {
    try {
      // Get the full file path for matches data.
      const { matchesFilePath } = getFilePaths(getCustomSavePathGlobal())
      fs.writeFileSync(matchesFilePath, JSON.stringify(JSON.parse(data), null, 2), 'utf-8')
      return { success: true }
    } catch (error) {
      console.error('Error saving matches:', error)
      appendToLog(`Error saving matches: ${error.message}`, getLogFilePathGlobal())
      return { success: false, error: error.message }
    }
  })
}

export {
  setupDataHandlers
}
