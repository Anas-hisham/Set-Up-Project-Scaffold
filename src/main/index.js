/* eslint-disable no-undef */
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import Store from 'electron-store'
import pkg from 'electron-updater';


const { autoUpdater } = pkg;
const store = new Store()
const __dirname = path.dirname(fileURLToPath(import.meta.url))


let mainWindow


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

let jsonFolderPath
let playerImageFolder
let matchImageFolder
let teamsImageFolder

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

ensureFoldersExist(customSavePath)

function getFilePaths() {
  return {
    teamsFilePath: path.join(jsonFolderPath, 'Brackets.json'),
    playersFilePath: path.join(jsonFolderPath, 'Players Stats.json'),
    matchesFilePath: path.join(jsonFolderPath, "Today's Matches.json"),
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
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


ipcMain.handle('set-custom-save-path', async (_event, newPath) => {
  try {
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

ipcMain.handle('load-teams-cache', () => store.get('teamsCache'))
ipcMain.handle('save-teams-cache', (_event, data) => {
  store.set('teamsCache', JSON.parse(data))
  return true
})

ipcMain.handle('save-teams', async (_event, data) => {
  try {
    const { teamsFilePath } = getFilePaths()
    const teams = JSON.parse(data)

    for (const team of teams) {
      for (const field of ['Team Image', 'Team Flag']) {
        if (team[field] && team[field].startsWith('data:image')) {
          const ext = team[field].substring(
            team[field].indexOf('/') + 1,
            team[field].indexOf(';')
          )
          const base64Data = team[field].split(',')[1]
          const filename = `team-${Date.now()}-${field.replace(/\s/g, '')}.${ext}`
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

ipcMain.handle('load-player-cache', () => store.get('playerCache'))
ipcMain.handle('save-player-cache', (_event, data) => {
  store.set('playerCache', JSON.parse(data))
  return true
})

ipcMain.handle('save-player', async (_event, data) => {
  try {
    const { playersFilePath } = getFilePaths()
    const players = JSON.parse(data)
    for (const player of players) {
      if (player['Hero Image'] && player['Hero Image'].startsWith('data:image')) {
        const ext = player['Hero Image'].substring(
          player['Hero Image'].indexOf('/') + 1,
          player['Hero Image'].indexOf(';')
        )
        const base64Data = player['Hero Image'].split(',')[1]
        const filename = `hero-${Date.now()}.${ext}`
        const filePath = path.join(playerImageFolder, filename)
        fs.writeFileSync(filePath, base64Data, 'base64')
        player['Hero Image'] = filePath
      }
    }
    fs.writeFileSync(playersFilePath, JSON.stringify(players, null, 2), 'utf-8')
    return { success: true }
  } catch (error) {
    console.error('Error saving players:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('load-matches-cache', () => store.get('matchesCache'))
ipcMain.handle('save-matches-cache', (_event, data) => {
  store.set('matchesCache', JSON.parse(data))
  return true
})

ipcMain.handle('save-matches', async (_event, data) => {
  try {
    const { matchesFilePath } = getFilePaths()
    const parsed = JSON.parse(data)

    const processedMatches = parsed.Matches.map(matchObj => {
      const matchKey = Object.keys(matchObj)[0]
      const match = matchObj[matchKey]

      for (const field of ['Left Team Logo', 'Right Team Logo', 'Left Team Flag', 'Right Team Flag']) {
        if (match[field] && match[field].startsWith('data:image')) {
          const matches = match[field].match(/^data:image\/(\w+);base64,(.+)$/)
          if (matches) {
            const [_, ext, base64Data] = matches
            const filename = `match-${Date.now()}-${field.replace(/\s+/g, '-')}.${ext}`
            const filePath = path.join(matchImageFolder, filename)
            fs.writeFileSync(filePath, base64Data, 'base64')
            match[field] = filePath
          }
        }
      }

      return { [matchKey]: match }
    })

    fs.writeFileSync(
      matchesFilePath,
      JSON.stringify({ Info: parsed.Info, Matches: processedMatches }, null, 2),
      'utf-8'
    )
    return { success: true }
  } catch (error) {
    console.error('Error saving matches:', error)
    return { success: false, error: error.message }
  }
})

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

ipcMain.handle('clear-data-cache', async () => {
  try {
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

ipcMain.handle('get-presets', async () => {
  try {
    return store.get('presets', {})
  } catch (error) {
    console.error('Error getting presets:', error)
    return {}
  }
})

ipcMain.handle('save-preset', async (event, { name, views }) => {
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

ipcMain.handle('delete-preset', async (event, name) => {
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
ipcMain.handle('rename-preset', async (event, oldName, newName) => {
  try {
    const presets = store.get('presets', {});
    if (presets[oldName]) {
      // Create a new object with the renamed property in the same position
      const newPresets = {};
      for (const [key, value] of Object.entries(presets)) {
        if (key === oldName) {
          newPresets[newName] = presets[oldName];
        } else {
          newPresets[key] = value;
        }
      }
      store.set('presets', newPresets);
    }
    return true;
  } catch (err) {
    console.error('Error renaming preset:', err);
    return false;
  }
});









ipcMain.handle('get-app-version', () => app.getVersion())






autoUpdater.autoDownload = false // Manual control

autoUpdater.on('update-available', () => {
  if (mainWindow?.webContents) {
    mainWindow.webContents.send('update_available')
  } else {
    console.error('Update check error: mainWindow is not ready (update-available)')
  }
})

autoUpdater.on('update-not-available', () => {
  if (mainWindow?.webContents) {
    mainWindow.webContents.send('update_not_available')
  } else {
    console.error('Update check error: mainWindow is not ready (update-not-available)')
  }
})

autoUpdater.on('update-downloaded', () => {
  if (mainWindow?.webContents) {
    mainWindow.webContents.send('update_downloaded')
  } else {
    console.error('Update check error: mainWindow is not ready (update-downloaded)')
  }
})

autoUpdater.on('download-progress', (progressObj) => {
  const percentage = Math.round(progressObj.percent)
  mainWindow.webContents.send('update-download-progress', percentage)
})




// Expose update check to renderer
ipcMain.handle('check-for-update', async () => {
  try {
    await autoUpdater.checkForUpdates()
  } catch (err) {
    console.error('Error checking for update:', err) // Log error to console
    return { error: err.message }
  }
})

ipcMain.handle('download-update', async () => {
  try {
    await autoUpdater.downloadUpdate()
  } catch (err) {
    console.error('Error downloading update:', err) // Log error to console
    return { error: err.message }
  }
})

ipcMain.on('quit-and-install', () => {
  autoUpdater.quitAndInstall()
})















ipcMain.on('log-error', (_event, message) => {
  appendToLog(message)
})

process.on('uncaughtException', (err) => {
  appendToLog(`Uncaught Exception: ${err.stack || err.message}`)
})

process.on('unhandledRejection', (reason) => {
  appendToLog(`Unhandled Rejection: ${reason}`)
})

app.whenReady()
  .then(() => {
    console.log('App is ready')
    createWindow()
  })
  .catch((error) => {
    console.error('Error during app start:', error)
  })
