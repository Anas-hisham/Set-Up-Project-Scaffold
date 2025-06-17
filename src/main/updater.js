import pkg from 'electron-updater'
import { ipcMain } from 'electron'
const { autoUpdater } = pkg;
export function initializeAutoUpdater(mainWindow) {
  autoUpdater.autoDownload = false

  // Update event handlers
  autoUpdater.on('update-available', (info) => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      console.error('Update check error: mainWindow is not ready')
      return
    }

    mainWindow.webContents.send('updateAvailable', {
      version: info.version || info.releaseName
    })
  })

  autoUpdater.on('update-not-available', () => {
    mainWindow?.webContents?.send('updateNotAvailable') ||
      console.error('Update check error: mainWindow is not ready')
  })

  autoUpdater.on('update-downloaded', () => {
    mainWindow?.webContents?.send('updateDownloaded') ||
      console.error('Update check error: mainWindow is not ready')
  })

  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow?.webContents?.send('updateDownloadProgress', Math.round(progressObj.percent))
  })

  // Expose update functions to IPC
  ipcMain.handle('checkForUpdate', async () => {
    try {
      await autoUpdater.checkForUpdates()
    } catch (err) {
      console.error('Error checking for update:', err)
      return { error: err.message }
    }
  })

  ipcMain.handle('downloadUpdate', async () => {
    try {
      await autoUpdater.downloadUpdate()
    } catch (err) {
      console.error('Error downloading update:', err)
      return { error: err.message }
    }
  })

  ipcMain.on('quitAndInstall', () => autoUpdater.quitAndInstall())
}
