<!-- BracketsView.vue -->
<template>
  <h1
    class="mt-12 text-4xl font-bold text-center"
    :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
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
        :handleFileChange="handleFileChange"
        :triggerFileInput="triggerFileInput"
        :displayMode="displayMode"
      />
    </div>
  </div>

  <div class="flex justify-center mb-10">
    <button
      @click="saveTeams"
      class="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
    >
      Save Teams
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import TeamInputs from '../components/TeamInputs.vue'

defineProps({ displayMode: String })

const teams = ref([])

const createTeam = () => ({
  'Team Image': '',
  'Team Flag': '',
  'Team Name': '',
  'Team Score': 0,
})

const teamsLoop = () => {
  let TeamsReturn = []
  for (let i = 0; i < 32; i++) {
    TeamsReturn.push(createTeam())
  }
  teams.value = TeamsReturn
}

const imageRefs = ref([])
const flagRefs = ref([])

function handleFileChange(event, index, type) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      teams.value[index][type] = reader.result

    }
    reader.readAsDataURL(file)
  }
}

function triggerFileInput(refsArray, index) {
  refsArray[index]?.click()
}

async function saveTeams() {
  try {
    await window.myAPI.saveTeams(JSON.stringify(teams.value))
  } catch (err) {
    window.myAPI.logError(`Error saving teams: ${err.message}`)
  }
}

async function loadTeams() {
  try {
    const loaded = await window.myAPI.loadTeamsCache()
    if (Array.isArray(loaded)) {
      loaded.forEach((team, index) => {
        if (teams.value[index]) {
          teams.value[index]['Team Image'] = team['Team Image'] || ''
          teams.value[index]['Team Flag'] = team['Team Flag'] || ''
          teams.value[index]['Team Name'] = team['Team Name'] || ''
          teams.value[index]['Team Score'] = team['Team Score'] || 0
        }
      })
    }
  } catch (e) {
    window.myAPI.logError(`Failed to load teams: ${e.message}`)
  }
}

watch(
  teams,
  () => {
    window.myAPI.saveTeamsCache(JSON.stringify(teams.value))
  },
  { deep: true },
)

onMounted(() => {
  teamsLoop()
  loadTeams()
})
</script>
