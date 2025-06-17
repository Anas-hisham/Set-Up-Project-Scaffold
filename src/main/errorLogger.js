import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import Store from 'electron-store'

const store = new Store()
const customSavePath = store.get('customSavePath') || app.getPath('userData')
const logFilePath = path.join(customSavePath, 'errors.log')

export function setupErrorHandling() {
  // Ensure log file exists
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '')
  }

  process.on('uncaughtException', (err) => {
    appendToLog(`Uncaught Exception: ${err.stack || err.message}`)
  })

  process.on('unhandledRejection', (reason) => {
    appendToLog(`Unhandled Rejection: ${reason}`)
  })
}

function appendToLog(message) {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`
  fs.appendFileSync(logFilePath, logMessage)
}
