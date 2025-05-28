<template>
  <div
    :class="[
      'app-container flex h-screen flex-col transition-colors duration-500',
      settings.displayMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black',
    ]"
  >
    <AppToolbar
      :currentTitle="views[selectedIndex]?.title || 'No View Selected'"
      :openSettings="openSettings"
      :displayMode="settings.displayMode"
    />

    <div class="grid grid-cols-15 flex-grow">
      <SideNav
        v-model:selectedIndex="selectedIndex"
        :views="views.filter((view) => view.title !== 'Settings')"
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
        <BracketView v-if="selectedIndex === 0" :displayMode="settings.displayMode" />
        <PlayersStatsView v-else-if="selectedIndex === 1" :displayMode="settings.displayMode" />
        <TodaysMatchesView v-else-if="selectedIndex === 2" :displayMode="settings.displayMode" />
        <SettingsView
          v-else-if="selectedIndex === 3"
          :settings="settings"
          :setSettings="setSettings"
          :resetSettings="resetSettings"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

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
}

const settings = ref({ ...defaultSettings })

// Load settings from Electron on mount
onMounted(async () => {
  try {
    const savedSettings = await window.myAPI.getViewSettingsCache()
    if (savedSettings) {
      settings.value = { ...defaultSettings, ...savedSettings }
    }
  } catch (err) {
    console.error('Failed to load settings:', err)
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
      console.error('Failed to save settings:', err)
    }
  },
  { deep: true },
)

function setSettings(newSettings) {
  settings.value = { ...settings.value, ...newSettings }
}

function resetSettings() {
  settings.value = { ...defaultSettings }
}
const previousIndex = ref(0)

function openSettings() {
  const settingsIndex = views.findIndex((v) => v.title === 'Settings')
  if (selectedIndex.value === settingsIndex) {
    selectedIndex.value = previousIndex.value
  } else {
    previousIndex.value = selectedIndex.value
    selectedIndex.value = settingsIndex
  }
}

const views = [
  { title: "Brackets View", component: BracketView },
  { title: 'Players Stats', component: PlayersStatsView },
  { title: "Today's Matches", component: TodaysMatchesView },
  { title: 'Settings', component: SettingsView },
]
</script>

<style>
.selected {
  background-color: #3b82f6;
  font-weight: bold;
  color: white;
}
</style>
