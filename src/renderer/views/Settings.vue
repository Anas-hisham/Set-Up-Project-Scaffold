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
      ⚙️ Application Settings
    </h2>

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

      <!-- Save Path with button -->
      <div class="md:col-span-2 flex items-center gap-4 justify-center">
        <div class="flex-grow">
          <label
            :class="[
              'block text-sm font-semibold mb-1',
              settings.displayMode === 'light' ? 'text-black' : 'text-white',
            ]"
          >
          </label>
          <input
            v-model="settings.savePath"
            type="text"
            placeholder="/path/to/save"
            class="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-400"
            :class="
              settings.displayMode === 'dark'
                ? 'bg-gray-900 text-white border-gray-600'
                : 'bg-white text-gray-900 border-gray-300'
            "
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

    <!-- Manage Views Section -->
    <div class="mt-8">
      <h3
        :class="[
          'text-xl font-bold mb-4',
          settings.displayMode === 'light' ? 'text-black' : 'text-white',
        ]"
      >
        Manage Views
      </h3>
      <div
        class="bg-opacity-50 p-4 rounded-lg"
        :class="settings.displayMode === 'dark' ? 'bg-gray-800' : 'bg-gray-200'"
      >
        <div
          v-for="(view, index) in withoutSettings()"
          :key="index"
          class="flex items-center justify-between py-2 border-b"
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
              v-model="view.visible"
              @change="updateViewVisibility(index)"
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

    <!-- Buttons -->
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
const { settings, allViews, setSettings } = defineProps({
  settings: Object,
  allViews: Array,
  setSettings: Function,
  refreshView: Function,
  resetSettings: Function,
})

function withoutSettings() {
  return allViews.filter((view) => view.title !== 'Settings')
}

// Clear data cache
async function clearInput() {
  try {
    await window.myAPI.clearDataCache()
  } catch (err) {
    window.myAPI.logError(`Failed to clear data: ${err.message}`)
  }
}

// Apply save path change
async function applySavePath() {
  try {
    await window.myAPI.setCustomSavePath(settings.savePath)
  } catch (err) {
    window.myAPI.logError(`Error updating save path: ${err.message}`)
  }
}

// Update view visibility
function updateViewVisibility(index) {
  setSettings({
    ...settings,
    views: [...allViews],
  })
}
</script>
