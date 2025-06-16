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



/* -------------------- Router -------------------- */
const router = useRouter()
const route = useRoute()

/* -------------------- State: Settings -------------------- */
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

/* -------------------- State: Update Info -------------------- */
const updateInfo = ref({
  show: false,
  currentVersion: '',
  newVersion: '',
  progress: 0,
  downloading: false,
  downloaded: false,
  wasHandled: false,
})

/* -------------------- Computed -------------------- */
const visibleViews = computed(() => settings.value.views.filter((v) => v.visible))
const allViews = computed(() => settings.value.views)
const currentTitle = computed(() => route.meta?.title || 'Settings')

/* -------------------- Lifecycle -------------------- */
onMounted(async () => {
  try {
    // 1. Attach update listeners
    window.myAPI.onUpdateAvailable((_, info) => {
      if (!updateInfo.value.wasHandled) {
        updateInfo.value.show = true
        updateInfo.value.newVersion = info?.version
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
// Auto-save settings
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
  { deep: true }
)

// Track last viewed route
watch(
  () => route.path,
  (newPath) => {
    settings.value.lastView = newPath
    if (newPath !== '/settings') {
      settings.value.viewBeforeSetting = newPath
    }
  }
)

/* -------------------- Settings Handlers -------------------- */
function setSettings(newSettings) {
  settings.value = { ...settings.value, ...newSettings }
}

async function resetSettings() {
  await window.myAPI.setCustomSavePath('')
  const path = await window.myAPI.getDefaultSavePath()
  const currentViews = settings.value.views

  settings.value = {
    ...defaultSettings,
    savePath: path,
    views: currentViews,
  }
}

function openSettings() {
  if (route.path === '/settings') {
    const backTo = settings.value.viewBeforeSetting
    const isBackVisible = settings.value.views.find(
      (v) => v.visible && v.path === backTo
    )
    if (isBackVisible) {
      router.push(backTo)
    } else {
      const fallback = settings.value.views.find(
        (v) => v.path !== '/settings' && v.visible
      )
      if (fallback) router.push(fallback.path)
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
    updateInfo.value.show = false
    window.myAPI.installUpdate()
  })
}
</script>

