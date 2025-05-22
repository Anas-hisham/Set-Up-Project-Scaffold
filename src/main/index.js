import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
// import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// const filePath = path.join(app.getPath('userData'), 'teams.json')


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
// ipcMain.handle('save-teams', async (_event, data) => {
//   try {
//     fs.writeFileSync(filePath, data, 'utf-8')
//     return { success: true }
//   } catch (err) {
//     console.error('Error saving:', err)
//     return { success: false, error: err.message }
//   }
// })

// ipcMain.handle('load-teams', async () => {
//   try {
//     if (!fs.existsSync(filePath)) return []
//     const raw = fs.readFileSync(filePath, 'utf-8')
//     return JSON.parse(raw)
//   } catch (err) {
//     console.error('Error loading:', err)
//     return []
//   }
// })


app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
