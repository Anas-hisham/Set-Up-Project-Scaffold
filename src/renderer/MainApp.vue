<template>
  <div class="app-container flex h-screen flex-col">
    <div class="grid grid-cols-12">
      <SideNav v-model:selectedIndex="selectedIndex" :views="views" :selected="selected" />

      <MainContent :currentComponent="views[selectedIndex].component" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import SideNav from './components/SideNav.vue'
import MainContent from './components/MainContent.vue'

import BracketView from './views/Brackets.vue'
import PlayersStatsView from './views/Players-Stats.vue'
import TodaysMatchesView from './views/Todays-Matches.vue'

const views = [
  { title: 'Bracket View', component: BracketView },
  { title: 'Players Stats', component: PlayersStatsView },
  { title: "Today's Matches", component: TodaysMatchesView },
]

let selectedIndex = ref(0)
function selected(selectIndex) {
  selectedIndex.value = selectIndex
}
</script>

<style>
.selected {
  background-color: #3b82f6;
  font-weight: bold;
  color: white;
}
</style>
