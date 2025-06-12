<template>
  <div
    :class="[
      'mt-10 p-6 text-white min-h-screen transition-colors duration-500',
      settings.displayMode === 'dark' ? 'bg-[#2a3444] text-white' : 'bg-white text-gray-900',
    ]"
  >
    <h2
      :class="[
        'text-3xl font-extrabold text-center mb-10',
        settings.displayMode === 'light' ? 'text-black' : 'text-white',
      ]"
    >
      Settings
    </h2>

    <div class="my-12 text-center border-t border-gray-300 dark:border-gray-700 pt-8 px-4">
      <p
        :class="settings.displayMode === 'dark' ? 'text-gray-200' : 'text-gray-800'"
        class="text-lg font-medium"
      >
        Version: {{ appVersion }}
      </p>

      <button
        v-if="!updateAvailable"
        @click="checkForUpdate"
        class="mt-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white px-5 py-2.5 rounded-lg shadow-md"
      >
        Check for Update
      </button>

      <!-- Only show update UI if either manually checked or update is available -->
      <div v-if="showUpdateUI">
        <div v-if="updateAvailable" class="mt-4">
          <button
            @click="downloadUpdate"
            class="bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white px-5 py-2.5 rounded-lg shadow-md"
          >
            Download Update
          </button>
        </div>

        <p
          class="mt-5 text-sm"
          :class="settings.displayMode === 'dark' ? 'text-blue-300' : 'text-blue-700'"
        >
          {{ updateMessage }}
        </p>

        <!-- Optional progress bar -->
        <div
          v-if="downloadPercent > 0 && downloadPercent < 100"
          class="w-full max-w-lg mx-auto bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden mt-4"
        >
          <div
            class="bg-blue-500 h-3 transition-all duration-300"
            :style="{ width: downloadPercent + '%' }"
          ></div>
        </div>

        <div v-if="updateReady" class="mt-6">
          <button
            @click="installUpdate"
            class="bg-yellow-400 hover:bg-yellow-500 transition-colors duration-200 text-black font-semibold px-6 py-2.5 rounded-lg shadow-md"
          >
            Restart & Install
          </button>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Display Mode -->
      <div>
        <label
          :class="[
            'block text-sm font-semibold mb-1',
            settings.displayMode === 'light' ? 'text-black' : 'text-white',
          ]"
        >
          Display Mode
        </label>
        <select
          v-model="settings.displayMode"
          class="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
          :class="
            settings.displayMode === 'dark'
              ? 'bg-gray-900 text-white border-gray-600'
              : 'bg-white text-gray-900 border-gray-300'
          "
        >
          <option value="light">☀️ Light</option>
          <option value="dark">🌙 Dark</option>
        </select>
      </div>

      <!-- Navigation Mode -->
      <div>
        <label
          :class="[
            'block text-sm font-semibold mb-1',
            settings.displayMode === 'light' ? 'text-black' : 'text-white',
          ]"
        >
          Navigation Mode
        </label>
        <select
          v-model="settings.navMode"
          class="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
          :class="
            settings.displayMode === 'dark'
              ? 'bg-gray-900 text-white border-gray-600'
              : 'bg-white text-gray-900 border-gray-300'
          "
        >
          <option value="full">Full</option>
          <option value="mini">Mini</option>
        </select>
      </div>

      <!-- Save Path -->
      <div class="md:col-span-2 flex items-center gap-4 justify-center">
        <div class="flex-grow">
          <input
            v-model="settings.savePath"
            type="text"
            :placeholder="folderPath.value ? folderPath.value : settings.savePath"
            class="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
            :class="
              settings.displayMode === 'dark'
                ? 'bg-gray-900 text-white border-gray-600'
                : 'bg-white text-gray-900 border-gray-300'
            "
          />
        </div>
        <button
          class="font-bold px-4 py-2"
          :class="[settings.displayMode === 'dark' ? 'text-white' : 'text-black']"
          @click="selectFolder"
        >
          Select Folder
        </button>
        <button
          @click="applySavePath"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow transition"
        >
          Apply Path
        </button>
      </div>
      <div></div>
    </div>
    <!-- Action Buttons -->
    <div class="flex flex-wrap justify-between gap-4 my-6">
      <button
        @click="resetSettings"
        class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded-lg shadow transition"
      >
        Reset to Defaults
      </button>
      <button
        @click="clearInput"
        class="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg shadow transition"
      >
        Clear Input Data
      </button>
    </div>
    <!-- Manage Views -->
    <div class="mt-8">
      <h3
        :class="[
          'text-xl font-bold mb-4',
          settings.displayMode === 'light' ? 'text-black' : 'text-white',
        ]"
      >
        Manage Views
      </h3>
      <div class="bg-opacity-50 py-4 rounded-lg">
        <div
          v-for="(view, index) in withoutSettings()"
          :key="index"
          class="flex items-center justify-between py-4 border-b"
          :class="settings.displayMode === 'dark' ? 'border-gray-700' : 'border-gray-300'"
        >
          <span
            :class="['font-medium', settings.displayMode === 'light' ? 'text-black' : 'text-white']"
          >
            {{ view.title }}
          </span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="view.visible"
              @change="updateViewVisibility(index, $event)"
              class="sr-only peer"
            />

            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
              :class="
                settings.displayMode === 'dark'
                  ? 'peer-checked:bg-blue-600 bg-gray-700'
                  : 'peer-checked:bg-blue-500 bg-gray-300'
              "
            ></div>
          </label>
        </div>
      </div>
    </div>
    <div
      v-if="lastAppliedPreset"
      class="text-sm mb-2"
      :class="settings.displayMode === 'light' ? 'text-gray-600' : 'text-gray-300'"
    >
      Currently applied preset: <span class="font-semibold">{{ lastAppliedPreset }}</span>
    </div>
    <!-- Manage Presets -->
    <div class="mt-8">
      <h3
        :class="[
          'text-xl font-bold mb-4',
          settings.displayMode === 'light' ? 'text-black' : 'text-white',
        ]"
      >
        Manage Presets
      </h3>

      <div class="flex gap-2 mb-4">
        <input
          v-model="newPresetName"
          type="text"
          placeholder="New preset name"
          class="flex-grow p-2 rounded-lg border"
          :class="
            settings.displayMode === 'dark'
              ? 'bg-gray-900 text-white border-gray-600'
              : 'bg-white text-gray-900 border-gray-300'
          "
        />
        <button
          @click="handleSavePreset"
          class="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg shadow transition"
        >
          Save Current
        </button>
      </div>
      <div class="py-6 pb-2 space-y-4">
        <div
          v-for="(preset, index) in presetList"
          :key="index"
          class="border-b pb-4 last:border-none"
          :class="settings.displayMode === 'dark' ? 'border-gray-700' : 'border-gray-200'"
        >
          <!-- Preset name and action buttons -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <template v-if="editingName === preset.name">
                <input
                  v-model="editedPresetName"
                  class="p-1 rounded border text-sm"
                  :class="
                    settings.displayMode === 'dark'
                      ? 'bg-gray-900 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  "
                />
                <button
                  @click="confirmRename(preset.name)"
                  class="text-sm text-green-600 font-semibold"
                >
                  ✔️
                </button>
                <button @click="cancelRename" class="text-sm text-red-600 font-semibold">❌</button>
              </template>
              <template v-else>
                <button
                  @click="applyCurrentPreset(preset.name)"
                  class="px-3 py-1 rounded font-medium transition bg-orange-500 hover:bg-orange-600 text-white text-sm shadow"
                >
                  {{ preset.name }}
                </button>
              </template>
            </div>

            <!-- Control buttons including Save/Cancel if updating -->
            <div class="flex gap-2">
              <button
                @click="startRenaming(preset.name)"
                class="text-sm px-2 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white shadow"
              >
                Edit
              </button>

              <template v-if="updatingPreset === preset.name">
                <button
                  @click="confirmUpdatePreset(preset.name)"
                  class="text-sm px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white shadow"
                >
                  Save
                </button>
                <button
                  @click="cancelUpdatePreset"
                  class="text-sm px-2 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white shadow"
                >
                  Cancel
                </button>
              </template>
              <template v-else>
                <button
                  @click="startUpdatingPreset(preset)"
                  class="text-sm px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white shadow"
                >
                  Update
                </button>
              </template>

              <button
                @click="deletePreset(preset.name, index)"
                class="text-sm px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white shadow"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Toggle switches shown only during update -->
          <div
            v-if="updatingPreset === preset.name"
            class="mt-4 pl-2 space-y-2 border-l-2"
            :class="settings.displayMode === 'dark' ? 'border-gray-700' : 'border-gray-300'"
          >
            <template v-for="(view, i) in tempUpdatedViews" :key="i">
              <div v-if="view.title !== 'Settings'" class="flex items-center justify-between">
                <span
                  :class="[
                    'font-medium',
                    settings.displayMode === 'light' ? 'text-black' : 'text-white',
                  ]"
                >
                  {{ view.title }}
                </span>
                <input
                  type="checkbox"
                  :checked="view.visible"
                  class="w-5 h-5"
                  @change="onToggleView(i, $event)"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="alert.showAlert"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="closeAlert"
  >
    <div
      class="relative p-6 rounded-xl shadow-lg w-100 text-center"
      :class="[settings.displayMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black']"
    >
      <!-- Close Button -->
      <button
        @click="closeAlert"
        class="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl font-bold"
      >
        ×
      </button>

      <p class="mb-4">{{ alert.text }}</p>

      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        @click="closeAlert"
      >
        OK
      </button>
    </div>
  </div>

  <div
    v-if="confirmDialog.show"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="handleCancel()"
  >
    <div
      class="relative p-6 rounded-xl shadow-lg w-100 text-center"
      :class="[settings.displayMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black']"
    >
      <button
        @click="handleCancel()"
        class="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl font-bold"
      >
        ×
      </button>

      <p class="mb-4">{{ confirmDialog.message }}</p>

      <div class="flex justify-around gap-2">
        <button
          class="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          @click="handleConfirm(false)"
        >
          Create New Presist
        </button>
        <button
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          @click="handleConfirm(true)"
        >
          Update
        </button>
      </div>
    </div>
  </div>


</template>

<script setup>
import { ref, onMounted, computed, watch, reactive } from 'vue'

const { settings, allViews, setSettings, resetSettings, displayMode } = defineProps({
  settings: Object,
  allViews: Array,
  setSettings: Function,
  resetSettings: Function,
  displayMode: String,
})

const alert = reactive({
  showAlert: false,
  text: '',
})

function showAlert(text) {
  alert.text = text
  alert.showAlert = true
}

function closeAlert() {
  alert.showAlert = false
}

const confirmDialog = reactive({
  show: false,
  message: '',
  resolve: null,
})

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
    // null means cancelled, true means create new, false means overwrite
    confirmDialog.resolve(result !== null ? result : false)
  }
}

async function handleSavePreset() {
  // If we have a last applied preset, show the overwrite dialog
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

  // Otherwise (or if user chooses not to overwrite), require a new name
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

const folderPath = ref('')

const selectFolder = async () => {
  const path = await window.myAPI.selectFolder()
  if (path) {
    folderPath.value = path
    settings.savePath = path
  }
}

const presets = ref({})
const newPresetName = ref('')
const editingName = ref(null)
const editedPresetName = ref('')

const updatingPreset = ref(null)
const tempUpdatedViews = ref([])

const lastAppliedPreset = ref(null)

function startUpdatingPreset(preset) {
  updatingPreset.value = preset.name
  // Create a deep copy of the preset views
  tempUpdatedViews.value = JSON.parse(JSON.stringify(preset.views))
}

// Update the confirmUpdatePreset function
async function confirmUpdatePreset(name) {
  if (!name.trim()) return;

  if (!tempUpdatedViews.value.length) {
    return;
  }

  try {
    // Save the updated preset (only updates the preset definition)
    await savePreset(name, tempUpdatedViews.value);

    updatingPreset.value = null;
    tempUpdatedViews.value = [];

    showAlert(`Preset "${name}" saved successfully!`);

    // Reload presets to reflect changes
    await loadPresets();

    // Only apply the preset if it's the currently applied one
    if (lastAppliedPreset.value === name) {
      await applyCurrentPreset(name);
    }

  } catch (error) {
    console.error('Error saving preset:', error);
    showAlert('Failed to save preset');
  }
}

async function applyCurrentPreset(presetName) {
  const preset = presets.value[presetName];
  if (!preset) return;

  // Update last applied preset reference
  lastAppliedPreset.value = presetName;
  await window.myAPI.setLastAppliedPreset(presetName);

  // Apply the preset views
  const fullViews = allViews.map((view) => {
    const presetView = preset.find((v) => v.title === view.title);
    return presetView ? { ...view, visible: presetView.visible } : view;
  });

  setSettings({ ...settings, views: fullViews });
  showAlert(`Preset "${presetName}" applied!`);
}

function cancelUpdatePreset() {
  updatingPreset.value = null
  tempUpdatedViews.value = []
}

async function onToggleView(index, event) {
  const newValue = event.target.checked
  tempUpdatedViews.value[index].visible = newValue
}

// Convert presets object to array for consistent ordering
const presetList = computed(() => {
  return Object.entries(presets.value).map(([name, views]) => ({ name, views }))
})

function withoutSettings() {
  return allViews.filter((view) => view.title !== 'Settings')
}

async function updateViewVisibility(index, event) {
  const newValue = event.target.checked
  const view = allViews[index]
  view.visible = newValue
  setSettings({ ...settings, views: [...allViews] })
}

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
      await window.myAPI.setCustomSavePath(settings.savePath.trim())
    }
  },
)

async function loadPresets() {
  try {
    presets.value = (await window.myAPI.getPresets()) || {};

    // Check if last applied preset still exists
    if (lastAppliedPreset.value && !presets.value[lastAppliedPreset.value]) {
      lastAppliedPreset.value = null;
      await window.myAPI.setLastAppliedPreset('');
    }
  } catch (error) {
    window.myAPI.logError('Error loading presets:', error);
  }
}
async function savePreset(name, views) {
  if (!name.trim()) return

  try {
    const formattedViews = views.map((view) => ({
      title: view.title,
      visible: view.visible,
    }))

    await window.myAPI.savePreset(name.trim(), formattedViews)

    // Update local cache
    presets.value[name] = [...formattedViews]

    // If it was a "new" preset
    if (newPresetName.value === name) {
      newPresetName.value = ''
    }

    return true
  } catch (error) {
    window.myAPI.logError('Error saving preset:', error)
    return false
  }
}

async function deletePreset(name, index) {
  try {
    await window.myAPI.deletePreset(name)
    await loadPresets()
  } catch (error) {
    window.myAPI.logError('Error deleting preset:', error)
  }
}
async function applyPreset(name) {
  try {
    const preset = presets.value[name];
    if (!preset) {
      showAlert('Preset not found');
      return;
    }

    // Update last applied preset reference
    lastAppliedPreset.value = name;
    await window.myAPI.setLastAppliedPreset(name);

    // Don't apply the preset views immediately here
    // We'll handle the application when user confirms
  } catch (error) {
    console.error('Error applying preset:', error);
    showAlert('Failed to apply preset. Check console for details.');
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

    // Update lastAppliedPreset if the renamed preset was the current one
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

const appVersion = ref('')
const updateMessage = ref('')
const updateAvailable = ref(false)
const updateReady = ref(false)
const downloadPercent = ref(0)
const showUpdateUI = ref(false)

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

  // Check for updates automatically in background
  checkForUpdateAuto()

  window.myAPI.onUpdateAvailable(() => {
    updateMessage.value = 'New update available. Click to download.'
    updateAvailable.value = true
    showUpdateUI.value = true // Show UI when update is found automatically
  })

  window.myAPI.onUpdateNotAvailable(() => {
    // Only update message if UI is already shown (from manual check)
    if (showUpdateUI.value) {
      updateMessage.value = 'You are using the latest version.'
    }
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
    console.error('Update check error:', result.error)
    updateMessage.value = 'Failed to check for updates.'
    window.myAPI.logError('Update check error:', result.error)
  }
}

async function downloadUpdate() {
  updateMessage.value = '⬇Downloading update...'
  const result = await window.myAPI.downloadUpdate()
  if (result?.error) {
    console.error('Download update error:', result.error)
    updateMessage.value = 'Failed to download update.'
    window.myAPI.logError('Download update error:', result.error)
  }
}

function installUpdate() {
  window.myAPI.installUpdate()
}
</script>
