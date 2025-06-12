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
          settings.displayMode === 'dark' ? 'bg-[#2a3444] text-white' : 'bg-gray-100 text-black',
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
        :class="
          settings.displayMode === 'dark' ? 'bg-[#2a3444] text-white' : 'bg-gray-100 text-black'
        "
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
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SideNav from './components/SideNav.vue'
import AppToolbar from './components/AppToolbar.vue'
import Brackets from './views/Brackets.vue'
import PlayersStats from './views/PlayersStats.vue'
import TodayxMatches from './views/TodaysMatches.vue'
import Settings from './views/Settings.vue'
import Welcome from './views/Welcome.vue'

const router = useRouter()
const route = useRoute()

const defaultSettings = {
  displayMode: 'dark',
  navMode: 'full',
  savePath: '',
  lastView: '/welcome', // Set welcome as default view
  views: [
    { title: 'Home', path: '/welcome', visible: true },
    { title: 'Brackets View', path: '/brackets', visible: true },
    { title: 'Players Stats', path: '/players', visible: true },
    { title: "Today's Matches", path: '/matches', visible: true },
    { title: 'Settings', path: '/settings', visible: true },
  ],
}

const settings = ref({ ...defaultSettings })

const visibleViews = computed(() => settings.value.views.filter((v) => v.visible))
const allViews = computed(() => settings.value.views)
const currentTitle = computed(() => route.meta?.title || 'Settings')

// Update info state
const updateInfo = ref({
  show: false,
  currentVersion: '',
  newVersion: '',
  progress: 0,
  downloading: false,
  downloaded: false,
  wasHandled: false, // NEW FLAG
})

// Run on mount
onMounted(async () => {
  try {
    // 1. Attach update listeners FIRST
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

    // 2. Load settings
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

      if (
        settings.value.lastView === '/settings' &&
        visibleViews.value.some((v) => v.path === '/settings')
      ) {
        router.push('/settings')
      } else if (
        settings.value.lastView &&
        visibleViews.value.some((v) => v.path === settings.value.lastView) &&
        route.path !== settings.value.lastView
      ) {
        router.push(settings.value.lastView)
      } else if (!visibleViews.value.some((view) => view.path === route.path)) {
        const firstVisible = visibleViews.value[0]
        if (firstVisible) router.push(firstVisible.path)
      }
    }

    // 3. Get current app version
    const currentVer = await window.myAPI.getAppVersion()
    updateInfo.value.currentVersion = currentVer

    // 4. Check for update LAST
    await window.myAPI.checkForUpdate()
  } catch (err) {
    window.myAPI.logError(`Error loading settings: ${err.message}`)
  }
})

// Save on settings change
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

// Update last view when navigating
watch(
  () => route.path,
  (newPath) => {
    settings.value.lastView = newPath
  },
)

// Settings handlers
function setSettings(newSettings) {
  settings.value = { ...settings.value, ...newSettings }
}

async function resetSettings() {
  await window.myAPI.setCustomSavePath('')
  const path = await window.myAPI.getDefaultSavePath()

  settings.value = {
    ...defaultSettings,
    savePath: path,
    views: defaultSettings.views.map((view) => ({ ...view })),
  }
}

function openSettings() {
  if (route.path === '/settings') {
    const lastNonSettingsView = settings.value.views.find(
      (view) => view.path !== '/settings' && view.visible,
    )
    if (lastNonSettingsView) {
      router.push(lastNonSettingsView.path)
    }
  } else {
    router.push('/settings')
  }
}
function cancelUpdate() {
  updateInfo.value.show = false
  updateInfo.value.wasHandled = true // Prevent it from showing again
}

// Update modal actions
function downloadUpdate() {
  updateInfo.value.downloading = true
  updateInfo.value.wasHandled = true
  window.myAPI.downloadUpdate()

  window.myAPI.onUpdateDownloaded(() => {
    updateInfo.value.downloaded = true
    updateInfo.value.downloading = false
    window.myAPI.quitAndInstall() // ✅ Call it here only
  })
}
</script>
