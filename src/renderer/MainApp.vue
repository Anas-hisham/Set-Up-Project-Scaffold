<template>
  <div class="app-container flex h-screen flex-col">
    <!-- Toolbar -->
    <AppToolbar
      :currentTitle="views[selectedIndex]?.title || 'No View Selected'"
      :refreshView="refreshView"
      :openSettings="openSettings"
    />

    <!-- Main layout -->
    <div class="grid grid-cols-12">
      <SideNav v-model:selectedIndex="selectedIndex" :views="visibleViews" :selected="selected" />

      <main
        class="main-content col-span-9 lg:col-span-10 text-white p-6 bg-[#2a3444] min-h-[calc(100vh)]"
      >
        <!-- Manual if-else blocks to show the selected view -->
        <BracketView v-if="selectedIndex === 0" />
        <PlayersStatsView v-else-if="selectedIndex === 1" />
        <TodaysMatchesView v-else-if="selectedIndex === 2" />
        <SettingsView
          v-else-if="selectedIndex === 3"
          :views="views"
          :onViewsChange="handleViewChange"
        />
        <div v-else class="text-center text-gray-400 mt-20">
          No view selected or component not available.
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import AppToolbar from './components/AppToolbar.vue'
import SideNav from './components/SideNav.vue'

import BracketView from './views/Brackets.vue'
import PlayersStatsView from './views/Players-Stats.vue'
import TodaysMatchesView from './views/Todays-Matches.vue'
import SettingsView from './views/Settings.vue'

const views = ref([
  { title: 'Bracket View', visible: true },
  { title: 'Players Stats', visible: true },
  { title: "Today's Matches", visible: true },
  { title: 'Settings', visible: false },
])

const visibleViews = computed(() => views.value.filter((view) => view.visible))

const selectedIndex = ref(0)

function selected(index) {
  selectedIndex.value = index
}

function handleViewChange(updatedViews) {
  views.value = updatedViews

  if (window.api?.saveViewSettings) {
    window.api.saveViewSettings(JSON.stringify(updatedViews, null, 2))
  }
}

function refreshView() {
  for (let i = 0; i < views.value.length; i++) {
    if (views.value[i].title !== 'Settings') {
      views.value[i].visible = true
    }
  }

  if (window.api?.saveViewSettings) {
    window.api.saveViewSettings(JSON.stringify(views.value, null, 2))
  }
}

watch(
  views,
  () => {
    if (window.api?.saveViewSettings) {
      window.api.saveViewSettings(JSON.stringify(views, null, 2))
    }
  },
  { deep: true },
)

function openSettings() {
  const index = views.value.findIndex((v) => v.title === 'Settings')
  selectedIndex.value = index
}

onMounted(async () => {
  try {
    const savedViews = await window.api.getViewSettings()
    views.value = savedViews
    console.log(views.value)
  } catch (e) {
    console.error('Error loading view settings:', e)
  }
})
</script>

<style>
.selected {
  background-color: #3b82f6;
  font-weight: bold;
  color: white;
}
</style>
