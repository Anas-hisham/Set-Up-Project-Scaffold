// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import BracketView from '../views/Brackets.vue'
import PlayersStatsView from '../views/PlayersStats.vue'
import TodaysMatchesView from '../views/TodaysMatches.vue'
import SettingsView from '../views/Settings.vue'
import WelcomeView from '../views/Welcome.vue' // Import the new Welcome component

const routes = [
  {
    path: '/',
    redirect: '/welcome' // Changed from '/brackets' to '/welcome'
  },
  {
    path: '/welcome',
    component: WelcomeView,
    meta: { title: 'Welcome' }
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
