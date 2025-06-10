/* eslint-disable no-undef */
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import Store from 'electron-store'
import pkg from 'electron-updater';


const { autoUpdater } = pkg;
const store = new Store()
/*

In CommonJS, we have __dirname by default.
But in ES modules, we don’t. So we recreate it manually using this pattern:

*/
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/*

console.log(import.meta.url) ➜ 'file:///home/anas/projects/myApp/utils/test.js'

const filePath = fileURLToPath(import.meta.url);
console.log(filePath) ➜ '/home/anas/projects/myApp/utils/test.js'

const dirPath = path.dirname('/home/anas/projects/myApp/utils/test.js');
console.log(dirPath) ➜ '/home/anas/projects/myApp/utils'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname) ➜ '/home/anas/projects/myApp/utils'

*/

/*

Why we Use path.join?

1 - It automatically handles slashes (/ or \)

2 - Works on Windows, Linux, macOS

3 - Clean and readable code

const fullPath = path.join('src', 'components', 'App.js');
console.log(fullPath); ➜ src/components/App.js

const jsonPath = path.join(__dirname, 'data', 'info.json');
console.log(jsonPath); ➜ /home/anas/projects/myApp/utils/data/info.json

*/

let mainWindow


let customSavePath = store.get('customSavePath')
if (!customSavePath || typeof customSavePath !== 'string' || customSavePath.trim() === '') {
  customSavePath = app.getPath('userData')
}

console.log('Using save path:', customSavePath)
const logFilePath = path.join(customSavePath, 'errors.log')



function appendToLog(message) {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`
  fs.appendFileSync(logFilePath, logMessage)
}

let jsonFolderPath
let playerImageFolder
let matchImageFolder
let teamsImageFolder

function ensureFoldersExist(basePath) {
  jsonFolderPath = path.join(basePath, 'jsons')
  playerImageFolder = path.join(basePath, 'players-images')
  matchImageFolder = path.join(basePath, 'matches-images')
  teamsImageFolder = path.join(basePath, 'brackets-images')

  for (const folder of [jsonFolderPath, playerImageFolder, matchImageFolder, teamsImageFolder,]) {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true })
    }
  }
}

ensureFoldersExist(customSavePath)

if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, '')
}

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
          //  data:image/png;base64,xxxxxxx

          const ext = team[field].substring(
            team[field].indexOf('/') + 1,
            team[field].indexOf(';')
          )
          // Extract the image extension (like png, jpeg):
          const base64Data = team[field].split(',')[1]
          // "data:image/jpeg;base64,xxxxxxxxxxxx"

          const filename = `team-${Date.now()}-${field.replace(/\s/g, '')}.${ext}`
          // Generate a unique filename:
          const filePath = path.join(teamsImageFolder, filename)
          // Join folder + filename to get full image path:
          // '/home/anas/projects/teamImages/team-1717840234000-TeamImage.jpeg'

          fs.writeFileSync(filePath, base64Data, 'base64')
          // Write the base64 image to a file:
          // Creates a real image file on disk from the base64 string.
          // 'base64' means it decodes the string before saving.

          team[field] = filePath
          /*
          So now instead of:
          "Team Image": "data:image/jpeg;base64,..."
          It becomes:
          "Team Image": "/home/anas/projects/teamImages/team-1717840234000-TeamImage.jpeg"
          */
        }
      }
    }
    /*

    */
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
    const player = JSON.parse(data)
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

    fs.writeFileSync(playersFilePath, JSON.stringify(player, null, 2), 'utf-8')
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
          const ext = match[field].substring(
            match[field].indexOf('/') + 1,
            match[field].indexOf(';')
          )
          const base64Data = match[field].split(',')[1]
          const filename = `match-${Date.now()}-${field.replace(/\s/g, '')}.${ext}`
          const filePath = path.join(matchImageFolder, filename)
          fs.writeFileSync(filePath, base64Data, 'base64')
          match[field] = filePath
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
