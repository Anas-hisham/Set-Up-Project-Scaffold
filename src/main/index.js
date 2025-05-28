/* eslint-disable no-undef */
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import Store from 'electron-store'
const store = new Store()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const jsonFolderPath = path.join(app.getPath('userData'), 'jsons')
console.log(path.join(app.getPath('userData'), 'jsons'));


// Ensure the jsons directory exists
if (!fs.existsSync(jsonFolderPath)) {
  fs.mkdirSync(jsonFolderPath, { recursive: true })
}

const playerImageFolder = path.join(app.getPath('userData'), 'players-images')

if (!fs.existsSync(playerImageFolder)) {
  fs.mkdirSync(playerImageFolder, { recursive: true })
}


const matchImageFolder = path.join(app.getPath('userData'), 'match-images')

if (!fs.existsSync(matchImageFolder)) {
  fs.mkdirSync(matchImageFolder, { recursive: true })
}



const teamsImageFolder = path.join(app.getPath('userData'), 'brackets-images')

if (!fs.existsSync(teamsImageFolder)) {
  fs.mkdirSync(teamsImageFolder, { recursive: true })
}



const teamsFilePath = path.join(jsonFolderPath, 'Brackets.json')
const playersFilePath = path.join(jsonFolderPath, 'PlayersStats.json')
const matchesFilePath = path.join(jsonFolderPath, 'TodaysMatches.json')
// const settingsPath = path.join(jsonFolderPath, 'settings.json')

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),

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

ipcMain.handle('load-teams-cache', () => {
  return store.get('teamsCache')
})

ipcMain.handle('save-teams-cache', (_event, data) => {
  store.set('teamsCache', JSON.parse(data));
  return true;
});


ipcMain.handle('save-teams', async (_event, data) => {
  try {
    const teams = JSON.parse(data)

    for (const team of teams) {
      for (const field of ['image', 'flag']) {
        if (team[field] && team[field].startsWith('data:image')) {
          const ext = team[field].substring(
            team[field].indexOf('/') + 1,
            team[field].indexOf(';')
          )
          const base64Data = team[field].split(',')[1]
          const filename = `team-${Date.now()}-${field}.${ext}`
          const filePath = path.join(teamsImageFolder, filename)
          fs.writeFileSync(filePath, base64Data, 'base64')

          // Replace base64 string with local absolute file path
          team[field] = filePath
        }
      }
    }

    fs.writeFileSync(teamsFilePath, JSON.stringify(teams, null, 2), 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Error saving teams:', err)
    return { success: false, error: err.message }
  }
})

// ipcMain.handle('load-teams', async () => {
//   try {
//     if (!fs.existsSync(teamsFilePath)) return []
//     const raw = fs.readFileSync(teamsFilePath, 'utf-8')
//     return JSON.parse(raw)
//   } catch (err) {
//     console.error('Error loading teams:', err)
//     return []
//   }
// })

// Players

ipcMain.handle('load-player-cache', () => {
  return store.get('playerCache')
})

ipcMain.handle('save-player-cache', (event, data) => {
  store.set('playerCache', JSON.parse(data));
  return true;
});

ipcMain.handle('save-player', async (event, data) => {
  try {
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




// ipcMain.handle('load-player', async () => {
//   try {
//     if (!fs.existsSync(playersFilePath)) return []
//     const raw = fs.readFileSync(playersFilePath, 'utf-8')
//     return JSON.parse(raw)
//   } catch (err) {
//     console.error('Error loading players:', err)
//     return []
//   }
// })

// Matches

ipcMain.handle('load-matches-cache', () => {
  return store.get('matchesCache')
})

ipcMain.handle('save-matches-cache', (_event, data) => {
  store.set('matchesCache', JSON.parse(data));
  return true;
});


ipcMain.handle('save-matches', async (_event, data) => {
  try {
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

          // Save absolute local path in JSON
          match[field] = filePath
        }
      }
    }

    // Save final match object with local image paths
    fs.writeFileSync(matchesFilePath, JSON.stringify({ ...parsed, matches }, null, 2), 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Error saving matches:', err)
    return { success: false, error: err.message }
  }
})


// ipcMain.handle('load-matches', async () => {
//   try {
//     if (!fs.existsSync(matchesFilePath)) return []
//     const raw = fs.readFileSync(matchesFilePath, 'utf-8')
//     return JSON.parse(raw)
//   } catch (err) {
//     console.error('Error loading matches:', err)
//     return []
//   }
// })

// Settings


ipcMain.handle('save-settings-cache', async (_event, data) => {
  try {
    store.set('settingsCache', data);
    return true;
  } catch (err) {
    console.error('Error saving settings:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-settings-cache', async () => {
  return store.get('settingsCache')

})

ipcMain.handle('clear-data-cache', async () => {
  try {
    const filesToDelete = [teamsFilePath, playersFilePath, matchesFilePath,
      // settingsPath
    ]

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


// ipcMain.handle('save-settings', async (_event, data) => {
//   try {
//     fs.writeFileSync(settingsPath, JSON.stringify(data), 'utf-8')
//     return { success: true }
//   } catch (err) {
//     console.error('Error saving settings:', err)
//     return { success: false, error: err.message }
//   }
// })

// ipcMain.handle('get-settings', async () => {
//   try {
//     if (!fs.existsSync(settingsPath)) return null
//     const data = fs.readFileSync(settingsPath, 'utf-8')
//     return JSON.parse(data)
//   } catch (err) {
//     console.error('Error reading settings:', err)
//     return null
//   }
// })

// ipcMain.handle('clear-data', async () => {
//   try {
//     const filesToDelete = [teamsFilePath, playersFilePath, matchesFilePath, settingsPath]

//     for (const file of filesToDelete) {
//       if (fs.existsSync(file)) {
//         fs.unlinkSync(file)
//       }
//     }

//     return { success: true }
//   } catch (err) {
//     console.error('Error clearing data:', err)
//     return { success: false, error: err.message }
//   }
// })


app.whenReady()
  .then(() => {
    console.log('App is ready')
    createWindow()
  })
  .catch(err => {
    console.error('Error during app start:', err)
  })

