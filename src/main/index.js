/* eslint-disable no-undef */
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const teamsFilePath = path.join(app.getPath('userData'), 'teams.json')
const playersFilePath = path.join(app.getPath('userData'), 'players.json')
const matchesFilePath = path.join(app.getPath('userData'), 'matches.json')
const settingsPath = path.join(app.getPath('userData'), 'settings.json')


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
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'))
  }
}

ipcMain.handle('save-teams', async (_event, data) => {
  try {
    fs.writeFileSync(teamsFilePath, data, 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Error saving:', err)
    return { success: false, error: err.message }
  }
})

ipcMain.handle('load-teams', async () => {
  try {
    if (!fs.existsSync(teamsFilePath)) return []
    const raw = fs.readFileSync(teamsFilePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading:', err)
    return []
  }
})

// Players

ipcMain.handle('save-player', async (_event, data) => {
  try {
    fs.writeFileSync(playersFilePath, data, 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Error saving:', err)
    return { success: false, error: err.message }
  }
})

ipcMain.handle('load-player', async () => {
  try {
    if (!fs.existsSync(playersFilePath)) return []
    const raw = fs.readFileSync(playersFilePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading:', err)
    return []
  }
})

// Matches

ipcMain.handle('save-matches', async (_event, data) => {
  try {
    fs.writeFileSync(matchesFilePath, data, 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Error saving:', err)
    return { success: false, error: err.message }
  }
})

ipcMain.handle('load-matches', async () => {
  try {
    if (!fs.existsSync(matchesFilePath)) return []
    const raw = fs.readFileSync(matchesFilePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading:', err)
    return []
  }
})

// Save view settings
ipcMain.handle('save-settings', async (_event, data) => {
  try {
    fs.writeFileSync(settingsPath, data, 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Error saving view settings:', err)
    return { success: false, error: err.message }
  }
})

// Read view settings
ipcMain.handle('get-settings', () => {
  try {
    if (!fs.existsSync(settingsPath)) {
  return JSON.stringify([
        { title: 'Bracket View', visible: true },
        { title: 'Players Stats', visible: true },
        { title: "Today's Matches", visible: true },
        { title: 'Settings', visible: false }
      ])
    }
    const data = fs.readFileSync(settingsPath, 'utf-8')
    return data
  } catch (err) {
    console.error('Error reading view settings:', err)
    return []
  }
})




app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
