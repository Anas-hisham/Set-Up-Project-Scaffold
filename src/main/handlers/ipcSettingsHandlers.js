import { ipcMain } from 'electron'
import { appendToLog } from '../utils/fileManager.js'

function setupSettingsHandlers(store, getLogFilePathGlobal) {
  // Saves application settings to electron-store.
  ipcMain.handle('saveSettingsCache', async (_event, data) => {
    try {
      store.set('settingsCache', data)
      return { success: true }
    } catch (error) {
      console.error('Error saving settings:', error)
      appendToLog(`Error saving settings: ${error.message}`, getLogFilePathGlobal())
      return { success: false, error: error.message }
    }
  })

  // Retrieves application settings from electron-store.
  ipcMain.handle('getSettingsCache', async () => store.get('settingsCache'))

  // Sets the name of the last applied preset in electron-store.
  ipcMain.handle('setLastPreset', (_, name) => {
    try {
      store.set('lastAppliedPreset', name)
      return true
    } catch (error) {
      console.error('Error setting last preset:', error)
      appendToLog(`Error setting last preset: ${error.message}`, getLogFilePathGlobal())
      return false
    }
  })

  // Retrieves the name of the last applied preset from electron-store.
  ipcMain.handle('getLastPreset', () => store.get('lastAppliedPreset', ''))

  // Retrieves all stored presets from electron-store.
  ipcMain.handle('getPresets', async () => store.get('presets', {}))

  // Saves a new preset or updates an existing one in electron-store.
  ipcMain.handle('savePreset', async (_, { name, views }) => {
    try {
      const presets = store.get('presets', {})
      presets[name] = views // Store the views object under the given preset name.
      store.set('presets', presets)
      return true
    } catch (error) {
      console.error('Error saving preset:', error)
      appendToLog(`Error saving preset: ${error.message}`, getLogFilePathGlobal())
      return false
    }
  })

  // Deletes a specified preset from electron-store.
  ipcMain.handle('deletePreset', async (_, name) => {
    try {
      const presets = store.get('presets', {})
      delete presets[name] // Remove the preset by its name.
      store.set('presets', presets)
      return true
    } catch (error) {
      console.error('Error deleting preset:', error)
      appendToLog(`Error deleting preset: ${error.message}`, getLogFilePathGlobal())
      return false
    }
  })

  // Renames an existing preset in electron-store.
  ipcMain.handle('renamePreset', async (_, oldName, newName) => {
    try {
      const presets = store.get('presets', {})
      if (presets[oldName]) {
        const newPresets = {}
        // Iterate through existing presets and rename the target one.
        for (const [key, value] of Object.entries(presets)) {
          newPresets[key === oldName ? newName : key] = value
        }
        store.set('presets', newPresets)
      }
      return true
    } catch (err) {
      console.error('Error renaming preset:', err)
      appendToLog(`Error renaming preset: ${err.message}`, getLogFilePathGlobal())
      return false
    }
  })

  ipcMain.handle('clearLastAppliedPreset', async () => {
    try {
      store.delete('lastAppliedPreset')
      return true
    } catch (err) {
      console.error('Failed to Last Applied Preset:', err)
      appendToLog(`Failed to Last Applied Preset: ${err.message}`, getLogFilePathGlobal())
      return false
    }
  })

  // Clears all view presets and the last applied preset from electron-store.
  ipcMain.handle('clearAllViewPresets', async () => {
    try {
      store.delete('lastAppliedPreset')
      store.delete('presets')
      return true
    } catch (err) {
      console.error('Failed to clear presets:', err)
      appendToLog(`Failed to clear presets: ${err.message}`, getLogFilePathGlobal())
      return false
    }
  })
}

export {
  setupSettingsHandlers
}
