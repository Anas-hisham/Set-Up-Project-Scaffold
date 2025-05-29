<template>
  <div
    :class="[
      'app-container flex h-screen flex-col transition-colors duration-500',
      settings.displayMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black',
    ]"
  >
    <AppToolbar
      :currentTitle="visibleViews[selectedIndex]?.title || 'No View Selected'"
      :openSettings="openSettings"
      :displayMode="settings.displayMode"
    />

    <div class="grid grid-cols-15 flex-grow">
      <SideNav
        v-model:selectedIndex="selectedIndex"
        :views="visibleViews.filter((view) => view.title !== 'Settings')"
        :selected="selected"
        :navMode="settings.navMode"
        :displayMode="settings.displayMode"
      />

      <main
        :class="[
          'main-content p-6 min-h-full transition-colors duration-500',
          settings.navMode === 'full' ? 'col-span-12 lg:col-span-13' : 'col-span-14 lg:col-span-14',
          settings.displayMode === 'dark' ? 'bg-[#2a3444] text-white' : 'bg-gray-100 text-black',
        ]"
      >
        <BracketView
          v-if="selectedIndex === 0 && visibleViews[0]?.visible !== false"
          :displayMode="settings.displayMode"
        />
        <PlayersStatsView
          v-else-if="selectedIndex === 1 && visibleViews[1]?.visible !== false"
          :displayMode="settings.displayMode"
        />
        <TodaysMatchesView
          v-else-if="selectedIndex === 2 && visibleViews[2]?.visible !== false"
          :displayMode="settings.displayMode"
        />
        <SettingsView
          v-else-if="selectedIndex === 3"
          :settings="settings"
          :allViews="allViews"
          :setSettings="setSettings"
          :resetSettings="resetSettings"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'

import SideNav from './components/SideNav.vue'
import AppToolbar from './components/AppToolbar.vue'

import BracketView from './views/Brackets.vue'
import PlayersStatsView from './views/PlayersStats.vue'
import TodaysMatchesView from './views/TodaysMatches.vue'
import SettingsView from './views/Settings.vue'

const selectedIndex = ref(0)

function selected(index) {
  selectedIndex.value = index
}

const defaultSettings = {
  displayMode: 'dark',
  navMode: 'full',
  savePath: '',
  views: [
    { title: 'Brackets View', component: BracketView, visible: true },
    { title: 'Players Stats', component: PlayersStatsView, visible: true },
    { title: "Today's Matches", component: TodaysMatchesView, visible: true },
    { title: 'Settings', component: SettingsView, visible: true },
  ],
}

const settings = ref({ ...defaultSettings })

// Computed property for visible views
const visibleViews = computed(() => {
  return settings.value.views.filter((view) => view.visible)
})

// All views including hidden ones
const allViews = computed(() => {
  return settings.value.views
})

// Load settings from Electron on mount
onMounted(async () => {
  try {
    const savedSettings = await window.myAPI.getViewSettingsCache()
    if (savedSettings) {
      // Merge with default to ensure new views are added
      const mergedViews = defaultSettings.views.map((defaultView) => {
        const savedView = savedSettings.views?.find((v) => v.title === defaultView.title)
        return savedView ? { ...defaultView, visible: savedView.visible } : defaultView
      })

      settings.value = {
        ...defaultSettings,
        ...savedSettings,
        views: mergedViews,
      }
    }
  } catch (err) {
    window.myAPI.logError(`Error loading settings: ${err.message}`)
  }
})

watch(
  settings,
  async (newSettings) => {
    try {
      // Convert reactive to plain object before sending
      const plainSettings = JSON.parse(JSON.stringify(newSettings))
      await window.myAPI.saveViewSettingsCache(plainSettings)
    } catch (err) {
      window.myAPI.logError(`Error saving settings: ${err.message}`)
    }
  },
  { deep: true },
)

function setSettings(newSettings) {
  settings.value = { ...settings.value, ...newSettings }
}
function resetSettings() {
  // Clear path from settings before saving
  settings.value = {
    ...defaultSettings,
    savePath: '', // or null if you want
  }

  // Also clear custom path from persistent store (optional but recommended)
  window.myAPI.setCustomSavePath('')
}


const previousIndex = ref(0)

function openSettings() {
  const settingsIndex = allViews.value.findIndex((v) => v.title === 'Settings')
  if (selectedIndex.value === settingsIndex) {
    selectedIndex.value = previousIndex.value
  } else {
    previousIndex.value = selectedIndex.value
    selectedIndex.value = settingsIndex
  }
}
</script>
