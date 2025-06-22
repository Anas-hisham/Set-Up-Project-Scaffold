// autoUpdaterHandlers.js
import { ipcMain } from 'electron'

function setupAutoUpdaterHandlers(autoUpdater, getMainWindow, appendToLog, getLogFilePathGlobal) {
  // Set autoDownload to false so we can control when to download updates
  autoUpdater.autoDownload = false

  // ======================
  // Auto Update Event Handlers
  // ======================
  autoUpdater.on('update-available', (info) => {
    const currentMainWindow = getMainWindow()
    if (!currentMainWindow || currentMainWindow.isDestroyed()) {
      console.error('Update check error: mainWindow is not ready for update-available event');
      return;
    }
    // Send a message to the renderer process that an update is available
    currentMainWindow.webContents.send('updateAvailable', {
      version: info.version || info.releaseName
    });
  });

  autoUpdater.on('update-not-available', () => {
    const currentMainWindow = getMainWindow()
    if (!currentMainWindow || currentMainWindow.isDestroyed()) {
      console.error('Update check error: mainWindow is not ready for update-not-available event');
      return;
    }
    currentMainWindow.webContents.send('updateNotAvailable')
  })

  autoUpdater.on('update-downloaded', () => {
    const currentMainWindow = getMainWindow()
    if (!currentMainWindow || currentMainWindow.isDestroyed()) {
      console.error('Update check error: mainWindow is not ready for update-downloaded event');
      return;
    }
    currentMainWindow.webContents.send('updateDownloaded')
  })

  autoUpdater.on('download-progress', (progressObj) => {
    const currentMainWindow = getMainWindow()
    if (!currentMainWindow || currentMainWindow.isDestroyed()) {
      console.error('Update check error: mainWindow is not ready for download-progress event');
      return;
    }
    currentMainWindow.webContents.send('updateDownloadProgress', Math.round(progressObj.percent))
  })

  autoUpdater.on('error', (error) => {
    console.error('AutoUpdater error:', error);
    appendToLog(`AutoUpdater error: ${error.message}`, getLogFilePathGlobal());
    const currentMainWindow = getMainWindow();
    if (currentMainWindow && !currentMainWindow.isDestroyed()) {
      currentMainWindow.webContents.send('updateError', error.message);
    }
  });

  // ======================
  // Auto Update IPC Handlers
  // ======================
  ipcMain.handle('checkForUpdate', async () => {
    try {
      // Initiates the check for updates. This will trigger 'update-available' or 'update-not-available' events.
      await autoUpdater.checkForUpdates()
      return { success: true }
    } catch (err) {
      console.error('Error checking for update:', err)
      appendToLog(`Error checking for update: ${err.message}`, getLogFilePathGlobal())
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('downloadUpdate', async () => {
    try {
      // Initiates the download of the update. This will trigger 'download-progress' and 'update-downloaded' events.
      await autoUpdater.downloadUpdate()
      return { success: true }
    } catch (err) {
      console.error('Error downloading update:', err)
      appendToLog(`Error downloading update: ${err.message}`, getLogFilePathGlobal())
      return { success: false, error: err.message }
    }
  })

  ipcMain.on('quitAndInstall', () => {
    try {
      // Quits the app and installs the update.
      autoUpdater.quitAndInstall()
    } catch (error) {
      console.error('Error quitting and installing:', error)
      appendToLog(`Error quitting and installing: ${error.message}`, getLogFilePathGlobal())
    }
  })
}

export {
  setupAutoUpdaterHandlers,
}
