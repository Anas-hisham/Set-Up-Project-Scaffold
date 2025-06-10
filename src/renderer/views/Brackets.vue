<!-- BracketsView.vue -->
<template>
  <h1
    class="mt-12 text-4xl font-bold text-center"
    :class="isDarkMode ? 'text-white' : 'text-black'"
  >
    Brackets view
  </h1>

  <div class="flex justify-center py-10 px-4">
    <div class="w-full grid gap-2">
      <TeamInputs
        v-for="(team, index) in teams"
        :key="index"
        :team="team"
        :index="index"
        :imageRefs="imageRefs"
        :flagRefs="flagRefs"
        :onFileChange="handleFileChange"
        :onTriggerInput="triggerFileInput"
        :displayMode="displayMode"
      />
    </div>
  </div>

  <div class="flex justify-center mb-10">
    <button
      @click="saveTeamsToDisk"
      class="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
    >
      Save Teams
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import TeamInputs from '../components/TeamInputs.vue'

const props = defineProps({ displayMode: String })
const isDarkMode = computed(() => props.displayMode === 'dark')

const teams = ref([])
const imageRefs = ref([])
const flagRefs = ref([])

// ----- Factory -----
const createEmptyTeam = () => ({
  'Team Image': '',
  'Team Flag': '',
  'Team Name': '',
  'Team Score': 0,
})

// ----- Init Data -----
const initializeTeams = () => {
  teams.value = Array.from({ length: 32 }, createEmptyTeam)
}

// ----- File Handling -----
const handleFileChange = (event, index, field) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    teams.value[index][field] = reader.result
  }
  reader.readAsDataURL(file)
}

const triggerFileInput = (refsArray, index) => {
  refsArray[index]?.click()
}

// ----- Storage Layer -----
const saveTeamsToDisk = async () => {
  try {
    await window.myAPI.saveTeams(JSON.stringify(teams.value))
  } catch (err) {
    logError('Error saving teams', err)
  }
}

const loadTeamsFromCache = async () => {
  try {
    const cached = await window.myAPI.loadTeamsCache()
    if (Array.isArray(cached)) {
      cached.forEach((team, index) => {
        if (!teams.value[index]) return
        teams.value[index] = {
          'Team Image': team['Team Image'] || '',
          'Team Flag': team['Team Flag'] || '',
          'Team Name': team['Team Name'] || '',
          'Team Score': team['Team Score'] || 0,
        }
      })
    }
  } catch (err) {
    logError('Failed to load teams', err)
  }
}

const logError = (message, error) => {
  window.myAPI.logError(`${message}: ${error.message}`)
}

// ----- Auto Save on Change -----
watch(
  teams,
  () => {
    window.myAPI.saveTeamsCache(JSON.stringify(teams.value))
  },
  { deep: true }
)

// ----- Lifecycle -----
onMounted(() => {
  initializeTeams()
  loadTeamsFromCache()
})
</script>
