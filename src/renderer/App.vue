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

      <MainContent
        :path="route.path"
        :displayMode="settings.displayMode"
        :navMode="settings.navMode"
        :settings="settings"
        :allViews="allViews"
        :setSettings="setSettings"
        :resetSettings="resetSettings"
      />
    </div>

    <UpdateModal
      :show="updateInfo.show"
      :currentVersion="updateInfo.currentVersion"
      :newVersion="updateInfo.newVersion"
      :progress="updateInfo.progress"
      :downloading="updateInfo.downloading"
      :downloaded="updateInfo.downloaded"
      :displayMode="settings.displayMode"
      :onCancel="cancelUpdate"
      :onDownload="downloadUpdate"
    />
  </div>
</template>

<script setup>
/* -------------------- Imports -------------------- */
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import SideNav from './components/main/SideNav.vue'
import AppToolbar from './components/main/AppToolbar.vue'
import MainContent from './components/main/MainContent.vue'
import UpdateModal from './components/main/UpdateModal.vue'

/* -------------------- Router Initialization -------------------- */
const router = useRouter()
const route = useRoute()

/* -------------------- State: Application Settings -------------------- */
// Default settings configuration
const defaultSettings = {
  displayMode: 'dark', // Default theme (dark/light)
  navMode: 'full', // Navigation mode (full/mini)
  savePath: '', // Custom save path for data
  lastView: '/welcome', // Last viewed page
  viewBeforeSetting: '/welcome', // Previous view before settings
  views: [
    // Available application views
    { title: 'Brackets View', path: '/brackets', visible: true },
    { title: 'Players Stats', path: '/players', visible: true },
    { title: "Today's Matches", path: '/matches', visible: true },
    { title: 'Settings', path: '/settings', visible: true },
  ],
}

// Reactive settings object initialized with defaults
const settings = ref({ ...defaultSettings })

/* -------------------- State: Update Information -------------------- */
// Reactive object to track update status
const updateInfo = ref({
  show: false, // Whether to show update modal
  currentVersion: '', // Currently installed version
  newVersion: '', // Available new version
  progress: 0, // Download progress percentage
  downloading: false, // Whether update is downloading
  downloaded: false, // Whether update is downloaded
  wasHandled: false, // Whether user has responded to update
})

/* -------------------- Computed Properties -------------------- */
// Get only visible views from settings
const visibleViews = computed(() => settings.value.views.filter((v) => v.visible))
// Get all views (including hidden ones)
const allViews = computed(() => settings.value.views)
// Get current view title from route meta or default to 'Settings'
const currentTitle = computed(() => route.meta?.title || 'Settings')

/* -------------------- Lifecycle Hooks -------------------- */
onMounted(async () => {
  try {
    // 1. Set up Electron update event listeners
    window.myAPI.onUpdateAvailable((_, info) => {
      // Show update modal if not already handled
      if (!updateInfo.value.wasHandled) {
        updateInfo.value.show = true
        updateInfo.value.newVersion = info?.version
      }
    })

    // Track download progress
    window.myAPI.onDownloadProgress((percent) => {
      updateInfo.value.progress = percent
    })

    // Handle update downloaded event
    window.myAPI.onUpdateDownloaded(() => {
      updateInfo.value.downloaded = true
      updateInfo.value.downloading = false
      updateInfo.value.show = false
      window.myAPI.installUpdate()
    })

    // 2. Load saved settings from persistent storage
    const savedSettings = await window.myAPI.getViewSettingsCache()

    if (savedSettings) {
      // Merge saved settings with defaults, preserving visibility states
      const mergedViews = defaultSettings.views.map((defaultView) => {
        const savedView = savedSettings.views?.find((v) => v.title === defaultView.title)
        return savedView ? { ...defaultView, visible: savedView.visible } : defaultView
      })

      // Update settings with merged values
      settings.value = {
        ...defaultSettings,
        ...savedSettings,
        views: mergedViews,
      }

      // Handle navigation based on saved settings
      const last = settings.value.lastView
      const isVisible = (path) => visibleViews.value.some((view) => view.path === path)

      if (last === '/settings' && isVisible('/settings')) {
        router.push('/settings')
      } else if (last && isVisible(last) && route.path !== last) {
        router.push(last) // Navigate to last viewed page
      } else if (!isVisible(route.path)) {
        // If current route isn't visible, go to first visible view
        const firstVisible = visibleViews.value[0]
        if (firstVisible) router.push(firstVisible.path)
      }
    }

    // 3. Get current application version
    updateInfo.value.currentVersion = await window.myAPI.getAppVersion()

    // 4. Check for available updates
    await window.myAPI.checkForUpdate()
  } catch (err) {
    window.myAPI.logError(`Error loading settings: ${err.message}`)
  }
})

/* -------------------- Watchers -------------------- */
// Auto-save settings when they change
watch(
  settings,
  async (newSettings) => {
    try {
      // Convert to plain object and save
      const plain = JSON.parse(JSON.stringify(newSettings))
      await window.myAPI.saveViewSettingsCache(plain)
    } catch (err) {
      window.myAPI.logError(`Error saving settings: ${err.message}`)
    }
  },
  { deep: true },
)

// Track route changes to update last viewed page
watch(
  () => route.path,
  (newPath) => {
    settings.value.lastView = newPath
    // Remember view before settings for back navigation
    if (newPath !== '/settings') {
      settings.value.viewBeforeSetting = newPath
    }
  },
)


/* -------------------- Settings Handlers -------------------- */

// Updates application settings
function setSettings(newSettings) {
  settings.value = { ...settings.value, ...newSettings }
}

// Resets settings to defaults

async function resetSettings() {
  // Reset custom save path
  await window.myAPI.setCustomSavePath('')
  // Get default save path
  const path = await window.myAPI.getDefaultSavePath()
  // Make all views visible
  const allVisibleViews = allViews.value.map((view) => ({ ...view, visible: true }))

  // Reset settings while preserving lastView
  settings.value = {
    ...defaultSettings,
    savePath: path,
    views: allVisibleViews,
    lastView: settings.value.lastView,
  }
}

// Toggles settings view or returns to previous view

function openSettings() {
  if (route.path === '/settings') {
    // If already in settings, go back to previous view
    const previousViewPath = settings.value.viewBeforeSetting
    const isBackVisible = settings.value.views.find((v) => v.visible && v.path === previousViewPath)

    if (isBackVisible) {
      router.push(previousViewPath)
    } else {
      // If previous view isn't visible, go to first visible view
      const defaultView = settings.value.views.find((v) => v.path !== '/settings' && v.visible)
      if (defaultView) router.push(defaultView.path)
    }
  } else {
    // Navigate to settings
    router.push('/settings')
  }
}

/* -------------------- Update Handlers -------------------- */

// Cancels the pending update

function cancelUpdate() {
  updateInfo.value.show = false
  updateInfo.value.wasHandled = true
}

// Initiates update download

function downloadUpdate() {
  updateInfo.value.downloading = true
  updateInfo.value.wasHandled = true
  window.myAPI.downloadUpdate()
}
</script>
