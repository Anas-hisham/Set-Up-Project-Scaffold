/* eslint-disable no-undef */
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import Store from 'electron-store'

const store = new Store()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Start with stored or default path

let customSavePath = store.get('customSavePath')

if (!customSavePath || typeof customSavePath !== 'string' || customSavePath.trim() === '') {
  customSavePath = app.getPath('userData')
}

console.log('Using save path:', customSavePath)



const logFilePath = path.join(customSavePath, 'errors.log')

function appendToLog(message) {
  const logMessage = `[${new Date()}] ${message}\n`
  fs.appendFileSync(logFilePath, logMessage)
}





// Folder paths - updated dynamically
let jsonFolderPath
let playerImageFolder
let matchImageFolder
let teamsImageFolder

// Create or update folder paths and ensure folders exist
function ensureFoldersExist(basePath) {
  jsonFolderPath = path.join(basePath, 'jsons')
  playerImageFolder = path.join(basePath, 'players-images')
  matchImageFolder = path.join(basePath, 'match-images')
  teamsImageFolder = path.join(basePath, 'brackets-images')

  for (const folder of [jsonFolderPath, playerImageFolder, matchImageFolder, teamsImageFolder]) {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true })
    }
  }
}

// Initialize folders at startup
ensureFoldersExist(customSavePath)

// Return current JSON file paths
function getFilePaths() {
  return {
    teamsFilePath: path.join(jsonFolderPath, 'Brackets.json'),
    playersFilePath: path.join(jsonFolderPath, 'PlayersStats.json'),
    matchesFilePath: path.join(jsonFolderPath, 'TodaysMatches.json'),
  }
}

// Create main window
function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
    },
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'))
  }
}


// IPC handler to set custom save path and recreate folders
ipcMain.handle('set-custom-save-path', async (_event, newPath) => {
  try {
    // If newPath is empty, null, or just whitespace, use default
    if (!newPath || typeof newPath !== 'string' || newPath.trim() === '') {
      newPath = app.getPath('userData')
    }

    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath, { recursive: true })
    }

    store.set('customSavePath', newPath)
    customSavePath = newPath
    ensureFoldersExist(customSavePath)

    return { success: true }
  } catch (error) {
    console.error('Error setting custom save path:', error)
    return { success: false, error: error.message }
  }
})

// Load and save teams cache
ipcMain.handle('load-teams-cache', () => store.get('teamsCache'))

ipcMain.handle('save-teams-cache', (_event, data) => {
  store.set('teamsCache', JSON.parse(data))
  return true
})

// Save teams with image processing
ipcMain.handle('save-teams', async (_event, data) => {
  try {
    const { teamsFilePath } = getFilePaths()
    const teams = JSON.parse(data)
    for (const team of teams) {
      for (const field of ['image', 'flag']) {
        if (team[field] && team[field].startsWith('data:image')) {
          const ext = team[field].substring(team[field].indexOf('/') + 1, team[field].indexOf(';'))
          const base64Data = team[field].split(',')[1]
          const filename = `team-${Date.now()}-${field}.${ext}`
          const filePath = path.join(teamsImageFolder, filename)
          fs.writeFileSync(filePath, base64Data, 'base64')
          team[field] = filePath
        }
      }
    }
    fs.writeFileSync(teamsFilePath, JSON.stringify(teams, null, 2), 'utf-8')
    return { success: true }
  } catch (error) {
    console.error('Error saving teams:', error)
    return { success: false, error: error.message }
  }
})

// Load and save player cache
ipcMain.handle('load-player-cache', () => store.get('playerCache'))

ipcMain.handle('save-player-cache', (_event, data) => {
  store.set('playerCache', JSON.parse(data))
  return true
})

// Save players with hero image processing
ipcMain.handle('save-player', async (_event, data) => {
  try {
    const { playersFilePath } = getFilePaths()
    const players = JSON.parse(data)
    for (const player of players) {
      if (player.hero && player.hero.startsWith('data:image')) {
        const ext = player.hero.substring(player.hero.indexOf('/') + 1, player.hero.indexOf(';'))
        const base64Data = player.hero.split(',')[1]
        const filename = `hero-${Date.now()}.${ext}`
        const filePath = path.join(playerImageFolder, filename)
        fs.writeFileSync(filePath, base64Data, 'base64')
        player.hero = filePath
      }
    }
    fs.writeFileSync(playersFilePath, JSON.stringify(players, null, 2), 'utf-8')
    return { success: true }
  } catch (error) {
    console.error('Error saving players:', error)
    return { success: false, error: error.message }
  }
})

// Load and save matches cache
ipcMain.handle('load-matches-cache', () => store.get('matchesCache'))

ipcMain.handle('save-matches-cache', (_event, data) => {
  store.set('matchesCache', JSON.parse(data))
  return true
})

// Save matches with image processing
ipcMain.handle('save-matches', async (_event, data) => {
  try {
    const { matchesFilePath } = getFilePaths()
    const parsed = JSON.parse(data)
    const matches = parsed.matches
    for (const match of matches) {
      for (const field of ['leftLogo', 'rightLogo', 'leftFlag', 'rightFlag']) {
        if (match[field] && match[field].startsWith('data:image')) {
          const ext = match[field].substring(match[field].indexOf('/') + 1, match[field].indexOf(';'))
          const base64Data = match[field].split(',')[1]
          const filename = `match-${Date.now()}-${field}.${ext}`
          const filePath = path.join(matchImageFolder, filename)
          fs.writeFileSync(filePath, base64Data, 'base64')
          match[field] = filePath
        }
      }
    }
    fs.writeFileSync(matchesFilePath, JSON.stringify({ ...parsed, matches }, null, 2), 'utf-8')
    return { success: true }
  } catch (error) {
    console.error('Error saving matches:', error)
    return { success: false, error: error.message }
  }
})

// Save and get settings cache
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

// Clear data cache by deleting JSON files
ipcMain.handle('clear-data-cache', async () => {
  try {
    // Clear the cached keys in electron-store (without deleting JSON files)
    store.delete('teamsCache')
    store.delete('playerCache')
    store.delete('matchesCache')
    store.delete('settingsCache')
    store.delete('customSavePath')

    return { success: true }
  } catch (error) {
    console.error('Error clearing cache:', error)
    return { success: false, error: error.message }
  }
})






// Handle renderer-to-main log requests
ipcMain.on('log-error', (_event, message) => {
  appendToLog(message)
})

// Catch unhandled errors in the main process
process.on('uncaughtException', (err) => {
  appendToLog(`Uncaught Exception: ${err.stack || err.message}`)
})

process.on('unhandledRejection', (reason) => {
  appendToLog(`Unhandled Rejection: ${reason}`)
})







// Ready event
app.whenReady()
  .then(() => {
    console.log('App is ready')
    createWindow()
  })

  .catch((error) => {
    console.error('Error during app start:', error)
  })
