import { app } from 'electron'
import { createWindow } from './windowManager.js'
import { setupErrorHandling } from './errorLogger.js'
import { registerIpcHandlers } from './ipcHandlers.js'
import { initializeAutoUpdater } from './updater.js'

// Initialize error handling
setupErrorHandling()

// App lifecycle
app.whenReady()
  .then(() => {
    console.log('App is ready')
    const mainWindow = createWindow()
    registerIpcHandlers(mainWindow)
    initializeAutoUpdater(mainWindow)
  })
  .catch((error) => {
    console.error('Error during app start:', error)
  })
