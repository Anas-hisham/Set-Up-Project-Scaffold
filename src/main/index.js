/* eslint-disable no-undef */
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const jsonFolderPath = path.join(app.getPath('userData'), 'jsons')
console.log( path.join(app.getPath('userData'), 'jsons'));


// Ensure the jsons directory exists
if (!fs.existsSync(jsonFolderPath)) {
  fs.mkdirSync(jsonFolderPath, { recursive: true })
}

const teamsFilePath = path.join(jsonFolderPath, 'teams.json')
const playersFilePath = path.join(jsonFolderPath, 'players.json')
const matchesFilePath = path.join(jsonFolderPath, 'matches.json')
const settingsPath = path.join(jsonFolderPath, 'settings.json')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'))
  }
}

// Teams

ipcMain.handle('save-teams', async (_event, data) => {
  try {
    fs.writeFileSync(teamsFilePath, data, 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Error saving teams:', err)
    return { success: false, error: err.message }
  }
})

ipcMain.handle('load-teams', async () => {
  try {
    if (!fs.existsSync(teamsFilePath)) return []
    const raw = fs.readFileSync(teamsFilePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading teams:', err)
    return []
  }
})

// Players

ipcMain.handle('save-player', async (_event, data) => {
  try {
    fs.writeFileSync(playersFilePath, data, 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Error saving players:', err)
    return { success: false, error: err.message }
  }
})

ipcMain.handle('load-player', async () => {
  try {
    if (!fs.existsSync(playersFilePath)) return []
    const raw = fs.readFileSync(playersFilePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading players:', err)
    return []
  }
})

// Matches

ipcMain.handle('save-matches', async (_event, data) => {
  try {
    fs.writeFileSync(matchesFilePath, data, 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Error saving matches:', err)
    return { success: false, error: err.message }
  }
})

ipcMain.handle('load-matches', async () => {
  try {
    if (!fs.existsSync(matchesFilePath)) return []
    const raw = fs.readFileSync(matchesFilePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading matches:', err)
    return []
  }
})

// Settings

ipcMain.handle('save-settings', async (_event, data) => {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(data), 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Error saving settings:', err)
    return { success: false, error: err.message }
  }
})

ipcMain.handle('get-settings', async () => {
  try {
    if (!fs.existsSync(settingsPath)) return null
    const data = fs.readFileSync(settingsPath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading settings:', err)
    return null
  }
})

ipcMain.handle('clear-data', async () => {
  try {
    const filesToDelete = [teamsFilePath, playersFilePath, matchesFilePath, settingsPath]

    for (const file of filesToDelete) {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file)
      }
    }

    return { success: true }
  } catch (err) {
    console.error('Error clearing data:', err)
    return { success: false, error: err.message }
  }
})


app.whenReady()
  .then(() => {
    console.log('App is ready')
    createWindow()
  })
  .catch(err => {
    console.error('Error during app start:', err)
  })



  /*
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Create the 'json' folder in your app's root directory
const jsonFolderPath = path.join(__dirname, '../../jsons') // Adjust path as needed

// Ensure the json directory exists
if (!fs.existsSync(jsonFolderPath)) {
  // fs.mkdirSync(jsonFolderPath, { recursive: true })
}

// Define file paths inside the json folder
const teamsFilePath = path.join(jsonFolderPath, 'teams.json')
const playersFilePath = path.join(jsonFolderPath, 'players.json')
const matchesFilePath = path.join(jsonFolderPath, 'matches.json')
const settingsPath = path.join(jsonFolderPath, 'settings.json')
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'))
  }
}

// Teams

ipcMain.handle('save-teams', async (_event, data) => {
  try {
    fs.writeFileSync(teamsFilePath, data, 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Error saving teams:', err)
    return { success: false, error: err.message }
  }
})

ipcMain.handle('load-teams', async () => {
  try {
    if (!fs.existsSync(teamsFilePath)) return []
    const raw = fs.readFileSync(teamsFilePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading teams:', err)
    return []
  }
})

// Players

ipcMain.handle('save-player', async (_event, data) => {
  try {
    fs.writeFileSync(playersFilePath, data, 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Error saving players:', err)
    return { success: false, error: err.message }
  }
})

ipcMain.handle('load-player', async () => {
  try {
    if (!fs.existsSync(playersFilePath)) return []
    const raw = fs.readFileSync(playersFilePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading players:', err)
    return []
  }
})

// Matches

ipcMain.handle('save-matches', async (_event, data) => {
  try {
    fs.writeFileSync(matchesFilePath, data, 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Error saving matches:', err)
    return { success: false, error: err.message }
  }
})

ipcMain.handle('load-matches', async () => {
  try {
    if (!fs.existsSync(matchesFilePath)) return []
    const raw = fs.readFileSync(matchesFilePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading matches:', err)
    return []
  }
})

// Settings

ipcMain.handle('save-settings', async (_event, data) => {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(data), 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Error saving settings:', err)
    return { success: false, error: err.message }
  }
})

ipcMain.handle('get-settings', async () => {
  try {
    if (!fs.existsSync(settingsPath)) return null
    const data = fs.readFileSync(settingsPath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading settings:', err)
    return null
  }
})

ipcMain.handle('clear-settings', async () => {
  try {
    if (fs.existsSync(settingsPath)) {
      fs.unlinkSync(settingsPath) // Delete the settings.json file
    }
    return { success: true }
  } catch (err) {
    console.error('Error clearing settings:', err)
    return { success: false, error: err.message }
  }
})

app.whenReady()
  .then(() => {
    console.log('App is ready')
    createWindow()
  })
  .catch(err => {
    console.error('Error during app start:', err)
  })

  */
