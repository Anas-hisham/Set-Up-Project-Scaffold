<template>
  <BracketView />
  <PlayersStatsView />
  <TodaysMatchesView />
</template>

<script setup>
import BracketView from './views/Brackets.vue'
import PlayersStatsView from './views/Players-Stats.vue'
import TodaysMatchesView from './views/Todays-Matches.vue'
</script>

<style>
body {
  background-color: #2a3444;
}
</style>
