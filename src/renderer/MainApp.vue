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
          settings.navMode === 'full' ? 'col-span-4 md:col-span-3 lg:col-span-2' : 'col-span-1 lg:col-span-1',
        ]"
        :views="visibleViews.filter((view) => view.path !== '/settings')"
        :navMode="settings.navMode"
        :displayMode="settings.displayMode"
      />

      <main
        :class="[
          'main-content p-6 min-h-full transition-colors duration-500',
          settings.navMode === 'full' ? 'col-span-11 md:col-span-12 lg:col-span-13' : 'col-span-14 lg:col-span-14',
          settings.displayMode === 'dark' ? 'bg-[#2a3444] text-white' : 'bg-gray-100 text-black',
        ]"
      >
        <Brackets
          v-if="route.path === '/brackets'"
          :displayMode="settings.displayMode"
        />
        <PlayersStats
          v-else-if="route.path === '/players'"
          :displayMode="settings.displayMode"
        />
        <TodayxMatches
          v-else-if="route.path === '/matches'"
          :displayMode="settings.displayMode"
        />
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

const router = useRouter()
const route = useRoute()

const defaultSettings = {
  displayMode: 'dark',
  navMode: 'full',
  savePath: '',
  views: [
    { title: 'Brackets View', path: '/brackets', visible: true },
    { title: 'Players Stats', path: '/players', visible: true },
    { title: "Today's Matches", path: '/matches', visible: true },
    { title: 'Settings', path: '/settings', visible: true },
  ],
}

const settings = ref({ ...defaultSettings })

const visibleViews = computed(() => {
  return settings.value.views.filter((view) => view.visible)
})

const allViews = computed(() => {
  return settings.value.views
})

const currentTitle = computed(() => {
  return route.meta?.title || 'Settings'
})

onMounted(async () => {
  try {
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

      if (!visibleViews.value.some((view) => view.path === route.path)) {
        const firstVisible = visibleViews.value[0]
        if (firstVisible) {
          router.push(firstVisible.path)
        }
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
      const plainSettings = JSON.parse(JSON.stringify(newSettings))
      await window.myAPI.saveViewSettingsCache(plainSettings)
    } catch (err) {
      window.myAPI.logError(`Error saving settings: ${err.message}`)
    }
  },
  { deep: true }
)

function setSettings(newSettings) {
  settings.value = { ...settings.value, ...newSettings }
}

function resetSettings() {
  settings.value = {
    ...defaultSettings,
    savePath: '',
    views: defaultSettings.views.map((view) => ({ ...view })),
  }
  window.myAPI.setCustomSavePath('')

}

function openSettings() {
  if (route.path === '/settings') {
    const firstVisible = visibleViews.value.find((view) => view.path !== '/settings')
    if (firstVisible) {
      router.push(firstVisible.path)
    }
  } else {
    router.push('/settings')
  }
}
</script>
