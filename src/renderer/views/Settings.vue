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

    <ManageViews
      :views="withoutSettings()"
      :displayMode="settings.displayMode"
      :onViewVisibilityChange="updateViewVisibility"
    />

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
      :onToggleView="onToggleView"
      :onEditedPresetNameChange="(value) => (editedPresetName = value)"
    />
  </div>

  <AlertDialog
    :alert="alert"
    :displayMode="'dark'"
    :closeAlert="closeAlert"
  />


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
import { ref, onMounted, computed, watch, reactive } from 'vue'

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
const { settings, allViews, setSettings, resetSettings, displayMode } = defineProps({
  settings: Object,
  allViews: Array,
  setSettings: Function,
  resetSettings: Function,
  displayMode: String,
})

// ================== State ==================
const alert = reactive({
  showAlert: false,
  text: '',
})
const confirmDialog = reactive({ show: false, message: '', resolve: null })
const folderPath = ref('')
const newPresetName = ref('')
const editingName = ref(null)
const editedPresetName = ref('')
const updatingPreset = ref(null)
const tempUpdatedViews = ref([])
const lastAppliedPreset = ref(null)
const presets = ref({})

// Update UI
const appVersion = ref('')
const updateMessage = ref('')
const updateAvailable = ref(false)
const updateReady = ref(false)
const downloadPercent = ref(0)
const showUpdateUI = ref(false)

// ================== Alert & Confirm ==================
function showAlert(text) {
  alert.text = text
  alert.showAlert = true
}

function closeAlert() {
  alert.showAlert = false
}

function showConfirm(message) {
  confirmDialog.message = message
  confirmDialog.show = true
  return new Promise((resolve) => {
    confirmDialog.resolve = resolve
  })
}

function handleCancel() {
  confirmDialog.show = false
}

function handleConfirm(result) {
  confirmDialog.show = false
  if (confirmDialog.resolve) {
    confirmDialog.resolve(result !== null ? result : false)
  }
}

// ================== Folder Selection ==================

const selectFolder = async () => {
  const path = await window.myAPI.selectFolder()
  if (path) {
    folderPath.value = path
    settings.savePath = path
  }
}

// ================== Reset ==================

async function fullReset() {
  try {
    await resetSettings()

    await window.myAPI.clearAllViewPresets()

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
const presetList = computed(() =>
  Object.entries(presets.value).map(([name, views]) => ({ name, views })),
)

function withoutSettings() {
  return allViews.filter((view) => view.title !== 'Settings')
}

async function savePreset(name, views) {
  if (!name.trim()) return

  try {
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

async function loadPresets() {
  try {
    presets.value = (await window.myAPI.getPresets()) || {}
    if (lastAppliedPreset.value && !presets.value[lastAppliedPreset.value]) {
      lastAppliedPreset.value = null
      await window.myAPI.setLastAppliedPreset('')
      const allVisibleViews = allViews.map((view) => ({ ...view, visible: true }))
      setSettings({ ...settings, views: allVisibleViews })
    }
  } catch (error) {
    window.myAPI.logError('Error loading presets:', error)
  }
}

async function deletePreset(name) {
  try {
    await window.myAPI.deletePreset(name)
    await loadPresets()
  } catch (error) {
    window.myAPI.logError('Error deleting preset:', error)
  }
}

function startUpdatingPreset(preset) {
  updatingPreset.value = preset.name
  tempUpdatedViews.value = JSON.parse(JSON.stringify(preset.views))
}

function cancelUpdatePreset() {
  updatingPreset.value = null
  tempUpdatedViews.value = []
}

async function confirmUpdatePreset(name) {
  if (!name.trim() || !tempUpdatedViews.value.length) return

  try {
    await savePreset(name, tempUpdatedViews.value)
    updatingPreset.value = null
    tempUpdatedViews.value = []
    showAlert(`Preset "${name}" saved successfully!`)
    await loadPresets()
    if (lastAppliedPreset.value === name) {
      await applyCurrentPreset(name)
    }
  } catch (error) {
    console.error('Error saving preset:', error)
    showAlert('Failed to save preset')
  }
}

async function handleSavePreset() {
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

  if (!newPresetName.value.trim()) {
    showAlert('Please enter a name for the new preset')
    return
  }

  const presetName = newPresetName.value.trim()
  await savePreset(presetName, allViews)
  await applyPreset(presetName)
  showAlert(`New preset "${presetName}" created!`)
  newPresetName.value = ''
}

// ================== Preset Apply & Rename ==================
async function applyCurrentPreset(presetName) {
  const preset = presets.value[presetName]
  if (!preset) return

  lastAppliedPreset.value = presetName
  await window.myAPI.setLastAppliedPreset(presetName)

  const fullViews = allViews.map((view) => {
    const presetView = preset.find((v) => v.title === view.title)
    return presetView ? { ...view, visible: presetView.visible } : view
  })

  setSettings({ ...settings, views: fullViews })
  showAlert(`Preset "${presetName}" applied!`)
}

async function applyPreset(name) {
  try {
    const preset = presets.value[name]
    if (!preset) {
      showAlert('Preset not found')
      return
    }

    lastAppliedPreset.value = name
    await window.myAPI.setLastAppliedPreset(name)
  } catch (error) {
    console.error('Error applying preset:', error)
    showAlert('Failed to apply preset. Check console for details.')
  }
}

function startRenaming(name) {
  editingName.value = name
  editedPresetName.value = name
}

function cancelRename() {
  editingName.value = null
  editedPresetName.value = ''
}

async function confirmRename(oldName) {
  const newName = editedPresetName.value.trim()
  if (!newName) return

  try {
    await window.myAPI.renamePreset(oldName, newName)
    if (lastAppliedPreset.value === oldName) {
      lastAppliedPreset.value = newName
      await window.myAPI.setLastAppliedPreset(newName)
    }
    await loadPresets()
    cancelRename()
  } catch (error) {
    window.myAPI.logError('Error renaming preset:', error)
  }
}

// ================== View Toggles ==================
async function updateViewVisibility(index, event) {
  allViews[index].visible = event.target.checked
  setSettings({ ...settings, views: [...allViews] })
}

async function onToggleView(index, event) {
  tempUpdatedViews.value[index].visible = event.target.checked
}

// ================== Cache & Path ==================
async function clearInput() {
  try {
    await window.myAPI.clearDataCache()
  } catch (err) {
    window.myAPI.logError(`Failed to clear data: ${err.message}`)
  }
}

async function applySavePath() {
  try {
    const pathToApply = settings.savePath.trim()
    await window.myAPI.setCustomSavePath(pathToApply)
  } catch (err) {
    window.myAPI.logError(`Error updating save path: ${err.message}`)
  }
}

watch(
  () => settings.savePath,
  async () => {
    if (settings.savePath.trim() === '') {
      await window.myAPI.setCustomSavePath('')
    }
  },
)

// ================== Updates ==================
async function checkForUpdateAuto() {
  const result = await window.myAPI.checkForUpdate()
  if (result?.error) {
    console.error('Auto update check error:', result.error)
    window.myAPI.logError('Auto update check error:', result.error)
  }
}

async function checkForUpdate() {
  showUpdateUI.value = true
  updateMessage.value = '🔍 Checking for updates...'
  const result = await window.myAPI.checkForUpdate()
  if (result?.error) {
    updateMessage.value = 'Failed to check for updates.'
    window.myAPI.logError('Update check error:', result.error)
  }
}

async function downloadUpdate() {
  updateMessage.value = '⬇Downloading update...'
  const result = await window.myAPI.downloadUpdate()
  if (result?.error) {
    updateMessage.value = 'Failed to download update.'
    window.myAPI.logError('Download update error:', result.error)
  }
}

function installUpdate() {
  window.myAPI.installUpdate()
}

// ================== Lifecycle ==================
onMounted(async () => {
  await loadPresets()

  try {
    const lastPreset = await window.myAPI.getLastAppliedPreset()
    lastAppliedPreset.value = lastPreset || ''
    if (lastAppliedPreset.value && presets.value[lastAppliedPreset.value]) {
      await applyPreset(lastAppliedPreset.value)
    }
  } catch (error) {
    console.error('Error loading last preset:', error)
    lastAppliedPreset.value = ''
  }

  if (window.myAPI?.getDefaultSavePath) {
    settings.savePath = await window.myAPI.getDefaultSavePath()
  }

  appVersion.value = await window.myAPI.getAppVersion()
  checkForUpdateAuto()

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
