// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import BracketView from '../views/Brackets.vue'
import PlayersStatsView from '../views/PlayersStats.vue'
import TodaysMatchesView from '../views/TodaysMatches.vue'
import SettingsView from '../views/Settings.vue'

const routes = [
  {
    path: '/',
    redirect: '/brackets'
  },
  {
    path: '/brackets',
    component: BracketView,
    meta: { title: 'Brackets View' }
  },
  {
    path: '/players',
    component: PlayersStatsView,
    meta: { title: 'Players Stats' }
  },
  {
    path: '/matches',
    component: TodaysMatchesView,
    meta: { title: "Today's Matches" }
  },
  {
    path: '/settings',
    component: SettingsView,
    meta: { title: 'Settings' }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
