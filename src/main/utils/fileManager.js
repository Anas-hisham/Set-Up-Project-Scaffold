// fileManager.js
import path from 'path'
import fs from 'fs'

// Creates error.log if missing in folder
function ensureLogExist(folderPath) {
  const logFile = path.join(folderPath, 'errors.log')
  if (!fs.existsSync(logFile)) {
    try {
      fs.writeFileSync(logFile, '')
    } catch (error) {
      console.error(`Failed to create log file at ${logFile}:`, error)
    }
  }
}

// Returns paths
function getFilePaths(customSavePath) {
  return {
    teamsFilePath: path.join(customSavePath, 'Brackets.json'),
    playersFilePath: path.join(customSavePath, 'Players Stats.json'),
    matchesFilePath: path.join(customSavePath, "Today's Matches.json"),
  }
}

// Appends timestamped message to log file
function appendToLog(message, logFilePath) {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`
  try {
    fs.appendFileSync(logFilePath, logMessage)
  } catch (error) {
    console.error(`Failed to append to log file at ${logFilePath}:`, error)
  }
}

export {
  ensureLogExist,
  getFilePaths,
  appendToLog,
}
