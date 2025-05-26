<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <h1
    class="mt-12 text-4xl font-bold text-center"
    :class="displayMode === 'dark' ? 'text-white' : 'text-black'"
  >
    Bracket’s view
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
      @click="saveAndAlertPlayers"
      class="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
    >
      Save Teams
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import TeamInputs from '../components/TeamInputs.vue'

defineProps({
  displayMode: {
    type: String,
  },
})

const teams = ref([])

const createTeam = () => ({
  image: '',
  flag: '',
  name: '',
  score: 0,
})

const teamsLoop = () => {
  let TeamsReturn = []
  for (let i = 0; i < 32; i++) {
    TeamsReturn.push(createTeam())
  }
  teams.value = TeamsReturn
}

const imageRefs = []
const flagRefs = []

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
    const result = await window.myAPI.saveTeams(JSON.stringify(teams.value))
    return result // Return the result so saveAndAlertPlayers can check it
  } catch (e) {
    console.error('Error saving teams:', e)
    return { success: false, error: e.message || 'Unknown error' } // Return failure object
  }
}

async function saveAndAlertPlayers() {
  try {
    const result = await saveTeams()
    if (result.success) {
      alert('Players saved successfully!')
    } else {
      alert('Failed to save players: ' + result.error)
      console.error('Failed to save players:', result.error)
    }
  } catch (err) {
    alert('Error saving players: ' + err.message)
    console.error('Error saving players:', err)
  }
}

async function loadTeams() {
  try {
    const loaded = await window.myAPI.loadTeams()
    loaded.forEach((team, index) => {
      if (teams.value[index]) {
        teams.value[index].image = team.image || ''
        teams.value[index].flag = team.flag || ''
        teams.value[index].name = team.name || ''
        teams.value[index].score = team.score || 0
      }
    })
  } catch (e) {
    console.error('Failed to load teams:', e)
  }
}

watch(
  teams,
  () => {
    saveTeams()
  },
  { deep: true },
)

onMounted(() => {
  teamsLoop()
  loadTeams()
})
</script>

<style>
.preview-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
</style>
