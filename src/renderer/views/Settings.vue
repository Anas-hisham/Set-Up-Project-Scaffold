<template>
  <div
    :class="[
      'mt-12 text-white min-h-screen transition-colors duration-500',
      settings.displayMode === 'dark' ? 'bg-[#2a3444] text-white' : 'bg-white text-gray-900',
    ]"
  >
    <h1
      :class="[
        'text-4xl font-bold text-center',
        settings.displayMode === 'light' ? 'text-black' : 'text-white',
      ]"
    >
      Settings
    </h1>

    <VersionInfo
      :appVersion="appVersion"
      :displayMode="settings.displayMode"
      :updateAvailable="updateAvailable"
      :showUpdateUI="showUpdateUI"
      :updateMessage="updateMessage"
      :downloadPercent="downloadPercent"
      :updateReady="updateReady"
      :onCheckForUpdate="checkForUpdate"
      :onDownloadUpdate="downloadUpdate"
      :onInstallUpdate="installUpdate"
    />

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Display Mode -->
      <DisplayModeSelector :settings="settings" :isDark="settings.displayMode === 'dark'" />
      <NavigationModeSelector :settings="settings" :isDark="settings.displayMode === 'dark'" />
      <SavePathInput
        :settings="settings"
        :folderPath="folderPath"
        :selectFolder="selectFolder"
        :applySavePath="applySavePath"
        :isDark="settings.displayMode === 'dark'"
      />
    </div>

    <!-- Action Buttons -->
    <ActionButtons :onReset="fullReset" :onClear="clearInput" />
    <!-- Manage Views -->

    <ManageViews :views="withoutSettings()" :displayMode="settings.displayMode" />

    <AppliedPresetIndicator :preset="lastAppliedPreset" :displayMode="settings.displayMode" />

    <!-- Manage Presets -->
    <PresetManager
      :displayMode="settings.displayMode"
      :newPresetName="newPresetName"
      :presetList="presetList"
      :editingName="editingName"
      :editedPresetName="editedPresetName"
      :updatingPreset="updatingPreset"
      :tempUpdatedViews="tempUpdatedViews"
      :onNewPresetNameChange="(value) => (newPresetName = value)"
      :onSavePreset="handleSavePreset"
      :onApplyPreset="applyCurrentPreset"
      :onStartRenaming="startRenaming"
      :onConfirmRename="confirmRename"
      :onCancelRename="cancelRename"
      :onStartUpdatingPreset="startUpdatingPreset"
      :onConfirmUpdatePreset="confirmUpdatePreset"
      :onCancelUpdatePreset="cancelUpdatePreset"
      :onDeletePreset="deletePreset"
      :onEditedPresetNameChange="(value) => (editedPresetName = value)"
    />
  </div>

  <AlertDialog :alert="alert" :displayMode="'dark'" :closeAlert="closeAlert" />

  <ConfirmDialog
    :show="confirmDialog.show"
    :message="confirmDialog.message"
    :displayMode="settings.displayMode"
    :onCancel="handleCancel"
    :onConfirm="handleConfirm"
  />
</template>
<script setup>
// ================== Imports ==================
// Vue reactivity and lifecycle functions
import { ref, onMounted, computed, watch, reactive } from 'vue'

// Component imports for settings panel
import DisplayModeSelector from '../components/settings/DisplayModeSelector.vue'
import NavigationModeSelector from '../components/settings/NavigationModeSelector.vue'
import SavePathInput from '../components/settings/SavePathInput.vue'
import AlertDialog from '../components/AlertComponent.vue'
import ConfirmDialog from '../components/settings/ConfirmDialog.vue'
import ManageViews from '../components/settings/ManageViews.vue'
import ActionButtons from '../components/settings/ActionButtons.vue'
import VersionInfo from '../components/settings/VersionInfo.vue'
import AppliedPresetIndicator from '../components/settings/AppliedPresetIndicator.vue'
import PresetManager from '../components/settings/PresetManager.vue'

// ================== Props ==================
// Define component props from parent
const { settings, allViews, setSettings, resetSettings, displayMode } = defineProps({
  settings: Object, // Current app settings
  allViews: Array, // All available views
  setSettings: Function, // Settings update function
  resetSettings: Function, // Reset to defaults function
  displayMode: String, // Current theme mode
})

// ================== State ==================
// Alert system state
const alert = reactive({
  showAlert: false, // Alert visibility
  text: '', // Alert message content
})

// Confirmation dialog state
const confirmDialog = reactive({
  show: false, // Dialog visibility
  message: '', // Dialog message
  resolve: null, // Promise resolver
})

// Folder path state
const folderPath = ref('') // Currently selected folder path

// Preset management states
const newPresetName = ref('') // New preset name input
const editingName = ref(null) // Currently editing preset name
const editedPresetName = ref('') // Edited preset name
const updatingPreset = ref(null) // Preset being updated
const tempUpdatedViews = ref([]) // Temporary view states during update
const lastAppliedPreset = ref(null) // Last used preset name
const presets = ref({}) // All saved presets

// Update system states
const appVersion = ref('') // Current app version
const updateMessage = ref('') // Update status message
const updateAvailable = ref(false) // Update available flag
const updateReady = ref(false) // Update downloaded flag
const downloadPercent = ref(0) // Download progress
const showUpdateUI = ref(false) // Update UI visibility

// ================== Alert & Confirm ==================
// Show alert message
function showAlert(text) {
  alert.text = text
  alert.showAlert = true
}

// Close alert dialog
function closeAlert() {
  alert.showAlert = false
}

// Show confirmation dialog and return promise
function showConfirm(message) {
  confirmDialog.message = message
  confirmDialog.show = true
  return new Promise((resolve) => {
    confirmDialog.resolve = resolve
  })
}

// Handle cancel action in dialog
function handleCancel() {
  confirmDialog.show = false
}

// Handle confirm action in dialog
function handleConfirm(result) {
  confirmDialog.show = false
  if (confirmDialog.resolve) {
    confirmDialog.resolve(result !== null ? result : false)
  }
}

// ================== Folder Selection ==================
// Open folder selection dialog
const selectFolder = async () => {
  const path = await window.myAPI.selectFolder()
  if (path) {
    folderPath.value = path
    settings.savePath = path
  }
}

// ================== Reset ==================
// Full reset of settings and presets
async function fullReset() {
  try {
    await resetSettings() // Reset to defaults settings
    await window.myAPI.clearLastAppliedPreset() // Clear all presets

    // Reset all local state
    lastAppliedPreset.value = null
    newPresetName.value = ''
    editedPresetName.value = ''
    editingName.value = null
    updatingPreset.value = null
    tempUpdatedViews.value = []
    folderPath.value = ''
  } catch (err) {
    console.error('Full reset failed:', err)
  }
}

// ================== Preset Management ==================
// Compute preset list as array from object
const presetList = computed(() =>
  Object.entries(presets.value).map(([name, views]) => ({ name: name, views: views })),
)

// Filter out Settings view from all views
function withoutSettings() {
  return allViews.filter((view) => view.title !== 'Settings')
}

// Save preset to storage
async function savePreset(name, views) {
  if (!name.trim()) return

  try {
    // Format views for storage
    const formattedViews = views.map((v) => ({ title: v.title, visible: v.visible }))
    await window.myAPI.savePreset(name.trim(), formattedViews)
    presets.value[name] = [...formattedViews]
    if (newPresetName.value === name) newPresetName.value = ''
    return true
  } catch (error) {
    window.myAPI.logError('Error saving preset:', error)
    return false
  }
}

// Load all presets from storage
async function loadPresets() {
  try {
    presets.value = (await window.myAPI.getPresets()) || {}
    // Handle case where last preset was deleted
    if (lastAppliedPreset.value && !presets.value[lastAppliedPreset.value]) {
      lastAppliedPreset.value = null
      await window.myAPI.setLastAppliedPreset('')
      // Reset to all views visible
      const allVisibleViews = allViews.map((view) => ({ ...view, visible: true }))
      setSettings({ ...settings, views: allVisibleViews })
    }
  } catch (error) {
    window.myAPI.logError('Error loading presets:', error)
  }
}

// Delete a preset
async function deletePreset(name) {
  try {
    await window.myAPI.deletePreset(name)
    await loadPresets()
  } catch (error) {
    window.myAPI.logError('Error deleting preset:', error)
  }
}

// Start preset update process
function startUpdatingPreset(preset) {
  updatingPreset.value = preset.name
  tempUpdatedViews.value = JSON.parse(JSON.stringify(preset.views))
}

// Cancel preset update
function cancelUpdatePreset() {
  updatingPreset.value = null
  tempUpdatedViews.value = []
}

// Confirm and save preset updates
async function confirmUpdatePreset(name) {
  if (!name.trim() || !tempUpdatedViews.value.length) return

  try {
    await savePreset(name, tempUpdatedViews.value)
    updatingPreset.value = null
    tempUpdatedViews.value = []
    showAlert(`Preset "${name}" saved successfully!`)
    await loadPresets()
    // Reapply if this was the current preset
    if (lastAppliedPreset.value === name) {
      await applyCurrentPreset(name)
    }
  } catch (error) {
    console.error('Error saving preset:', error)
    showAlert('Failed to save preset')
  }
}

// Handle save preset action
async function handleSavePreset() {
  // Update existing preset if one is applied
  if (lastAppliedPreset.value) {
    const shouldOverwrite = await showConfirm(
      `Update "${lastAppliedPreset.value}" with current visibility?`,
    )
    if (shouldOverwrite) {
      await savePreset(lastAppliedPreset.value, allViews)
      showAlert(`Preset "${lastAppliedPreset.value}" updated!`)
      return
    }
  }

  // Validate new preset name
  if (!newPresetName.value.trim()) {
    showAlert('Please enter a name for the new preset')
    return
  }

  // Create and apply new preset
  const presetName = newPresetName.value.trim()
  await savePreset(presetName, allViews)
  await applyPreset(presetName)
  showAlert(`New preset "${presetName}" created!`)
  newPresetName.value = ''
}

// ================== Preset Apply & Rename ==================
// Apply preset and update settings
async function applyCurrentPreset(presetName) {
  const preset = presets.value[presetName]
  if (!preset) return

  // Update last applied preset
  lastAppliedPreset.value = presetName
  await window.myAPI.setLastAppliedPreset(presetName)

  // Merge preset visibility with all views
  const fullViews = allViews.map((view) => {
    const presetView = preset.find((v) => v.title === view.title)
    return presetView ? { ...view, visible: presetView.visible } : view
  })

  // Update settings with new view states
  setSettings({ ...settings, views: fullViews })
  showAlert(`Preset "${presetName}" applied!`)
}

// Apply preset by name
async function applyPreset(name) {
  try {
    const preset = presets.value[name]
    if (!preset) {
      showAlert('Preset not found')
      return
    }

    // Update last applied preset
    lastAppliedPreset.value = name
    await window.myAPI.setLastAppliedPreset(name)
  } catch (error) {
    console.error('Error applying preset:', error)
    showAlert('Failed to apply preset. Check console for details.')
  }
}

// Start renaming a preset
function startRenaming(name) {
  editingName.value = name
  editedPresetName.value = name
}

// Cancel renaming process
function cancelRename() {
  editingName.value = null
  editedPresetName.value = ''
}

// Confirm and save renamed preset
async function confirmRename(oldName) {
  const newName = editedPresetName.value.trim()
  if (!newName) return

  try {
    await window.myAPI.renamePreset(oldName, newName)
    // Update last applied if it was this preset
    if (lastAppliedPreset.value === oldName) {
      lastAppliedPreset.value = newName
      await window.myAPI.setLastAppliedPreset(newName)
    }
    await loadPresets() // Refresh list
    cancelRename()
  } catch (error) {
    window.myAPI.logError('Error renaming preset:', error)
  }
}

// ================== Cache & Path ==================
// Clear cached data
async function clearInput() {
  try {
    await window.myAPI.clearDataCache()
  } catch (err) {
    window.myAPI.logError(`Failed to clear data: ${err.message}`)
  }
}

// Apply new save path
async function applySavePath() {
  try {
    const pathToApply = settings.savePath.trim()
    await window.myAPI.setCustomSavePath(pathToApply)
  } catch (err) {
    window.myAPI.logError(`Error updating save path: ${err.message}`)
  }
}

// Watch for save path changes
watch(
  () => settings.savePath,
  async () => {
    if (settings.savePath.trim() === '') {
      await window.myAPI.setCustomSavePath('')
    }
  },
)

// ================== Updates ==================
// Automatic background update check
async function checkForUpdateAuto() {
  const result = await window.myAPI.checkForUpdate()
  if (result?.error) {
    console.error('Auto update check error:', result.error)
    window.myAPI.logError('Auto update check error:', result.error)
  }
}

// Manual update check with UI feedback
async function checkForUpdate() {
  showUpdateUI.value = true
  updateMessage.value = '🔍 Checking for updates...'
  const result = await window.myAPI.checkForUpdate()
  if (result?.error) {
    updateMessage.value = 'Failed to check for updates.'
    window.myAPI.logError('Update check error:', result.error)
  }
}

// Download available update
async function downloadUpdate() {
  updateMessage.value = '⬇Downloading update...'
  const result = await window.myAPI.downloadUpdate()
  if (result?.error) {
    updateMessage.value = 'Failed to download update.'
    window.myAPI.logError('Download update error:', result.error)
  }
}

// Install downloaded update
function installUpdate() {
  window.myAPI.installUpdate()
}

// ================== Lifecycle ==================
onMounted(async () => {
  // Initial setup
  await loadPresets()

  try {
    // Load last applied preset
    const lastPreset = await window.myAPI.getLastAppliedPreset()
    lastAppliedPreset.value = lastPreset || ''
    // Apply if exists
    if (lastAppliedPreset.value && presets.value[lastAppliedPreset.value]) {
      await applyPreset(lastAppliedPreset.value)
    }
  } catch (error) {
    console.error('Error loading last preset:', error)
    lastAppliedPreset.value = ''
  }

  // Set default save path
  if (window.myAPI?.getDefaultSavePath) {
    settings.savePath = await window.myAPI.getDefaultSavePath()
  }

  // Get current version
  appVersion.value = await window.myAPI.getAppVersion()
  // Check for updates in background
  checkForUpdateAuto()

  // Set up update event listeners
  window.myAPI.onUpdateAvailable(() => {
    updateMessage.value = 'New update available. Click to download.'
    updateAvailable.value = true
    showUpdateUI.value = true
  })

  window.myAPI.onUpdateNotAvailable(() => {
    if (showUpdateUI.value) updateMessage.value = 'You are using the latest version.'
    updateAvailable.value = false
  })

  window.myAPI.onUpdateDownloaded(() => {
    updateMessage.value = 'Update ready. Restart to install.'
    updateReady.value = true
    showUpdateUI.value = true
  })

  window.myAPI.onDownloadProgress((percent) => {
    downloadPercent.value = percent
    updateMessage.value = `⬇Downloading update... ${percent}%`
    showUpdateUI.value = true
  })
})
</script>
