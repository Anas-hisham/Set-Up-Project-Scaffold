<template>
  <div
    :class="[
      'app-container flex h-screen flex-col transition-colors duration-500',
      settings.displayMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black',
    ]"
  >
    <AppToolbar
      :currentTitle="currentTitle"
      :openSettings="openSettings"
      :displayMode="settings.displayMode"
    />

    <div class="grid grid-cols-15 flex-grow">
      <SideNav
        :class="[
          settings.navMode === 'full'
            ? 'col-span-4 md:col-span-3 lg:col-span-2'
            : 'col-span-1 lg:col-span-1',
        ]"
        :views="visibleViews"
        :navMode="settings.navMode"
        :displayMode="settings.displayMode"
      />

      <main
        :class="[
          'main-content p-6 min-h-full transition-colors duration-500',
          settings.navMode === 'full'
            ? 'col-span-11 md:col-span-12 lg:col-span-13'
            : 'col-span-14 lg:col-span-14',
          settings.displayMode === 'dark' ? 'bg-[#2a3444] text-white' : 'bg-white text-black',
        ]"
      >
        <Welcome v-if="route.path === '/welcome'" :displayMode="settings.displayMode" />
        <Brackets v-if="route.path === '/brackets'" :displayMode="settings.displayMode" />
        <PlayersStats v-else-if="route.path === '/players'" :displayMode="settings.displayMode" />
        <TodayxMatches v-else-if="route.path === '/matches'" :displayMode="settings.displayMode" />
        <Settings
          v-else-if="route.path === '/settings'"
          :displayMode="settings.displayMode"
          :settings="settings"
          :allViews="allViews"
          :setSettings="setSettings"
          :resetSettings="resetSettings"
        />
      </main>
    </div>

    <!-- Update Modal -->
    <div
      v-if="updateInfo.show"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="cancelUpdate"
    >
      <div
        class="relative p-6 rounded-xl shadow-lg w-96 text-center"
        :class="settings.displayMode === 'dark' ? 'bg-[#2a3444] text-white' : 'bg-white text-black'"
      >
        <!-- Close Button -->
        <button
          @click="cancelUpdate"
          class="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl font-bold"
        >
          ×
        </button>

        <h2 class="text-xl font-bold mb-2">Update Available</h2>
        <p class="mb-2">Current version: {{ updateInfo.currentVersion }}</p>
        <p class="mb-4">New version: {{ updateInfo.newVersion }}</p>

        <div v-if="updateInfo.downloading" class="mb-4">
          <p>Downloading... {{ updateInfo.progress.toFixed(0) }}%</p>
          <div class="w-full bg-gray-300 h-2 rounded">
            <div
              class="bg-blue-500 h-2 rounded"
              :style="{ width: updateInfo.progress + '%' }"
            ></div>
          </div>
        </div>

        <button
          v-if="!updateInfo.downloading && !updateInfo.downloaded"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          @click="downloadUpdate"
        >
          Download Update
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/* -------------------- Imports -------------------- */
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SideNav from './components/SideNav.vue'
import AppToolbar from './components/AppToolbar.vue'
import Brackets from './views/Brackets.vue'
import PlayersStats from './views/PlayersStats.vue'
import TodayxMatches from './views/TodaysMatches.vue'
import Settings from './views/Settings.vue'
import Welcome from './views/Welcome.vue'

/* -------------------- Router -------------------- */
const router = useRouter()
const route = useRoute()

/* -------------------- Default Settings -------------------- */
const defaultSettings = {
  displayMode: 'dark',
  navMode: 'full',
  savePath: '',
  lastView: '/welcome',
  viewBeforeSetting: '/welcome',
  views: [
    { title: 'Brackets View', path: '/brackets', visible: true },
    { title: 'Players Stats', path: '/players', visible: true },
    { title: "Today's Matches", path: '/matches', visible: true },
    { title: 'Settings', path: '/settings', visible: true },
  ],
}

const settings = ref({ ...defaultSettings })

/* -------------------- Computed Properties -------------------- */
const visibleViews = computed(() => settings.value.views.filter((v) => v.visible))
const allViews = computed(() => settings.value.views)
const currentTitle = computed(() => route.meta?.title || 'Settings')

/* -------------------- Update Info -------------------- */
const updateInfo = ref({
  show: false,
  currentVersion: '',
  newVersion: '',
  progress: 0,
  downloading: false,
  downloaded: false,
  wasHandled: false,
})

/* -------------------- Lifecycle: onMounted -------------------- */
onMounted(async () => {
  try {
    // 1. Attach update listeners
    window.myAPI.onUpdateAvailable((_, info) => {
      if (!updateInfo.value.wasHandled) {
        updateInfo.value.show = true
        updateInfo.value.newVersion = info?.version || 'new'
      }
    })

    window.myAPI.onDownloadProgress((percent) => {
      updateInfo.value.progress = percent
    })

    window.myAPI.onUpdateDownloaded(() => {
      updateInfo.value.downloaded = true
      updateInfo.value.downloading = false
    })

    // 2. Load saved settings
    const savedSettings = await window.myAPI.getViewSettingsCache()

    if (savedSettings) {
      const mergedViews = defaultSettings.views.map((defaultView) => {
        const savedView = savedSettings.views?.find((v) => v.title === defaultView.title)
        return savedView ? { ...defaultView, visible: savedView.visible } : defaultView
      })

      settings.value = {
        ...defaultSettings,
        ...savedSettings,
        views: mergedViews,
      }

      // Navigation logic
      const last = settings.value.lastView

      const isVisible = (path) => visibleViews.value.some((v) => v.path === path)

      if (last === '/settings' && isVisible('/settings')) {
        router.push('/settings')
      } else if (last && isVisible(last) && route.path !== last) {
        router.push(last)
      } else if (!isVisible(route.path)) {
        const firstVisible = visibleViews.value[0]
        if (firstVisible) router.push(firstVisible.path)
      }
    }

    // 3. Get current version
    updateInfo.value.currentVersion = await window.myAPI.getAppVersion()

    // 4. Check for updates
    await window.myAPI.checkForUpdate()
  } catch (err) {
    window.myAPI.logError(`Error loading settings: ${err.message}`)
  }
})

/* -------------------- Watchers -------------------- */
// Save settings when they change
watch(
  settings,
  async (newSettings) => {
    try {
      const plain = JSON.parse(JSON.stringify(newSettings))
      await window.myAPI.saveViewSettingsCache(plain)
    } catch (err) {
      window.myAPI.logError(`Error saving settings: ${err.message}`)
    }
  },
  { deep: true },
)

// Update lastView on route change
watch(
  () => route.path,
  (newPath) => {
    settings.value.lastView = newPath
    if (newPath !== '/settings') {
      settings.value.viewBeforeSetting = newPath
    }
  },
)

/* -------------------- Settings Handlers -------------------- */
function setSettings(newSettings) {
  settings.value = { ...settings.value, ...newSettings }
}

async function resetSettings() {
  await window.myAPI.setCustomSavePath('')
  const path = await window.myAPI.getDefaultSavePath()

  settings.value = {
    ...defaultSettings,
    savePath: path,
    // views: defaultSettings.views.map((view) => ({ ...view })),
  }
}

function openSettings() {
  if (route.path === '/settings') {
    if (settings.value.viewBeforeSetting) {
      if (
        settings.value.views.find((v) => v.visible && v.path === settings.value.viewBeforeSetting)
      ) {
        router.push(settings.value.viewBeforeSetting)
      } else {
        const lastNonSettings = settings.value.views.find(
          (v) => v.path !== '/settings' && v.visible,
        )
        if (lastNonSettings) router.push(lastNonSettings.path)
      }
    }
  } else {
    router.push('/settings')
  }
}

/* -------------------- Update Handlers -------------------- */
function cancelUpdate() {
  updateInfo.value.show = false
  updateInfo.value.wasHandled = true
}

function downloadUpdate() {
  updateInfo.value.downloading = true
  updateInfo.value.wasHandled = true
  window.myAPI.downloadUpdate()

  window.myAPI.onUpdateDownloaded(() => {
    updateInfo.value.downloaded = true
    updateInfo.value.downloading = false
    updateInfo.value.show = false // Add this line to close the modal

  window.myAPI.installUpdate()
  })
}
</script>
