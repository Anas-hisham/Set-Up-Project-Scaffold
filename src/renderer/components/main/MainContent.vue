<template>
  <main
    :class="[
      'main-content p-6 min-h-full transition-colors duration-500',
      navMode === 'full'
        ? 'col-span-11 md:col-span-12 lg:col-span-13'
        : 'col-span-14 lg:col-span-14',
      displayMode === 'dark' ? 'bg-[#2a3444] text-white' : 'bg-white text-black',
    ]"
  >
    <Welcome v-if="path === '/welcome'" :displayMode="displayMode" />
    <Brackets v-if="path === '/brackets'" :displayMode="displayMode" />
    <PlayersStats v-else-if="path === '/players'" :displayMode="displayMode" />
    <TodaysMatches v-else-if="path === '/matches'" :displayMode="displayMode" />
    <Settings
      v-else-if="path === '/settings'"
      :displayMode="displayMode"
      :settings="settings"
      :allViews="allViews"
      :setSettings="setSettings"
      :resetSettings="resetSettings"
    />
  </main>
</template>

<script setup>
import Welcome from '../../views/Welcome.vue'
import Brackets from '../../views/Brackets.vue'
import PlayersStats from '../../views/PlayersStats.vue'
import TodaysMatches from '../../views/TodaysMatches.vue'
import Settings from '../../views/Settings.vue'

defineProps({
  path: String,
  displayMode: String,
  navMode: String,
  settings: Object,
  allViews: Array,
  setSettings: Function,
  resetSettings: Function,
})
</script>
