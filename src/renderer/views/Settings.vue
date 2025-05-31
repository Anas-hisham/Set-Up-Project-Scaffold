<template>
  <div
    :class="[
      'mt-10 p-6 text-white min-h-screen transition-colors duration-500',
      settings.displayMode === 'dark' ? 'bg-[#2a3444] text-white' : 'bg-white text-gray-900',
    ]"
  >
    <h2 :class="['text-3xl font-extrabold text-center mb-10', settings.displayMode === 'light' ? 'text-black' : 'text-white']">
      ⚙️ Application Settings
    </h2>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Display Mode -->
      <div>
        <label :class="['block text-sm font-semibold mb-1', settings.displayMode === 'light' ? 'text-black' : 'text-white']">
          Display Mode
        </label>
        <select
          v-model="settings.displayMode"
          class="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
          :class="settings.displayMode === 'dark' ? 'bg-gray-900 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
        >
          <option value="light">☀️ Light</option>
          <option value="dark">🌙 Dark</option>
        </select>
      </div>

      <!-- Navigation Mode -->
      <div>
        <label :class="['block text-sm font-semibold mb-1', settings.displayMode === 'light' ? 'text-black' : 'text-white']">
          Navigation Mode
        </label>
        <select
          v-model="settings.navMode"
          class="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
          :class="settings.displayMode === 'dark' ? 'bg-gray-900 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
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
            placeholder="/path/to/save"
            class="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
            :class="settings.displayMode === 'dark' ? 'bg-gray-900 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
          />
        </div>
        <button
          @click="applySavePath"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow transition"
        >
          Apply Path
        </button>
      </div>
    </div>

    <!-- Manage Views -->
    <div class="mt-8">
      <h3 :class="['text-xl font-bold mb-4', settings.displayMode === 'light' ? 'text-black' : 'text-white']">Manage Views</h3>
      <div class="bg-opacity-50 p-4 rounded-lg">
        <div
          v-for="(view, index) in withoutSettings()"
          :key="index"
          class="flex items-center justify-between py-4 border-b"
          :class="settings.displayMode === 'dark' ? 'border-gray-700' : 'border-gray-300'"
        >
          <span :class="['font-medium', settings.displayMode === 'light' ? 'text-black' : 'text-white']">
            {{ view.title }}
          </span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="view.visible" @change="updateViewVisibility(index)" class="sr-only peer" />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
              :class="settings.displayMode === 'dark' ? 'peer-checked:bg-blue-600 bg-gray-700' : 'peer-checked:bg-blue-500 bg-gray-300'"
            ></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Manage Presets -->
       <div class="mt-8">
      <h3 :class="['text-xl font-bold mb-4', settings.displayMode === 'light' ? 'text-black' : 'text-white']">Manage Presets</h3>

      <div class="flex gap-2 mb-4">
        <input
          v-model="newPresetName"
          type="text"
          placeholder="New preset name"
          class="flex-grow p-2 rounded-lg border"
          :class="settings.displayMode === 'dark' ? 'bg-gray-900 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
        />
        <button
          @click="savePreset"
          class="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg shadow transition"
        >
          Save Current
        </button>
      </div>

      <div class="p-6 pb-2 space-y-4">
        <div
          v-for="(preset, index) in presetList"
          :key="index"
          class="flex items-center justify-between border-b pb-4 last:border-none"
          :class="settings.displayMode === 'dark' ? 'border-gray-700' : 'border-gray-200'"
        >
          <div class="flex items-center gap-2">
            <template v-if="editingName === preset.name">
              <input
                v-model="editedPresetName"
                class="p-1 rounded border text-sm"
                :class="settings.displayMode === 'dark' ? 'bg-gray-900 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'"
              />
              <button @click="confirmRename(preset.name)" class="text-sm text-green-600 font-semibold">✔️</button>
              <button @click="cancelRename" class="text-sm text-red-600 font-semibold">❌</button>
            </template>
            <template v-else>
              <button
                @click="applyPreset(preset.name)"
                class="px-3 py-1 rounded-lg font-medium transition bg-orange-500 hover:bg-orange-600 text-white text-sm shadow"
              >
                {{ preset.name }}
              </button>
            </template>
          </div>

          <div class="flex gap-2">
            <button
              @click="() => startRenaming(preset.name)"
              class="text-sm px-2 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white shadow"
            >
              Edit
            </button>
            <button
              @click="updatePreset(preset.name)"
              class="text-sm px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white shadow"
            >
              Update
            </button>
            <button
              @click="deletePreset(preset.name, index)"
              class="text-sm px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white shadow"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap justify-between gap-4 pt-6">
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const { settings, allViews, setSettings, refreshView, resetSettings } = defineProps({
  settings: Object,
  allViews: Array,
  setSettings: Function,
  refreshView: Function,
  resetSettings: Function,
})

const presets = ref({})
const newPresetName = ref('')
const editingName = ref(null)
const editedPresetName = ref('')

// Convert presets object to array for consistent ordering
const presetList = computed(() => {
  return Object.entries(presets.value).map(([name, views]) => ({ name, views }))
})

function withoutSettings() {
  return allViews.filter((view) => view.title !== 'Settings')
}

function updateViewVisibility() {
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
    await window.myAPI.setCustomSavePath(settings.savePath)
  } catch (err) {
    window.myAPI.logError(`Error updating save path: ${err.message}`)
  }
}

onMounted(loadPresets)

async function loadPresets() {
  try {
    presets.value = (await window.myAPI.getPresets()) || {}
  } catch (error) {
    window.myAPI.logError('Error loading presets:', error)
  }
}

async function savePreset() {
  if (!newPresetName.value.trim()) return
  try {
    await window.myAPI.savePreset(
      newPresetName.value.trim(),
      allViews.map((view) => ({ title: view.title, visible: view.visible })),
    )
    await loadPresets()
    newPresetName.value = ''
  } catch (error) {
    window.myAPI.logError('Error saving preset:', error)
  }
}

async function updatePreset(name) {
  try {
    await window.myAPI.savePreset(
      name,
      allViews.map((view) => ({ title: view.title, visible: view.visible })),
    )
    await loadPresets()
  } catch (error) {
    window.myAPI.logError('Error updating preset:', error)
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

function applyPreset(name) {
  const preset = presets.value[name]
  if (preset) {
    const fullViews = allViews.map((view) => {
      const presetView = preset.find((v) => v.title === view.title)
      return presetView ? { ...view, visible: presetView.visible } : { ...view, visible: false }
    })
    setSettings({ ...settings, views: fullViews })
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
    await loadPresets()
    cancelRename()
  } catch (error) {
    window.myAPI.logError('Error renaming preset:', error)
  }
}
</script>
