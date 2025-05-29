<!-- eslint-disable vue/multi-word-component-names -->
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
      console.log(reader.result)
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
    window.myAPI.logError(`Error saving players: ${err.message}`)
  }
}

async function loadTeams() {
  try {
    const loaded = await window.myAPI.loadTeamsCache()
    loaded.forEach((team, index) => {
      if (teams.value[index]) {
        teams.value[index].image = team.image || ''
        teams.value[index].flag = team.flag || ''
        teams.value[index].name = team.name || ''
        teams.value[index].score = team.score || 0
      }
    })
    console.log(teams.value)
  } catch (e) {
    window.myAPI.logError(`Failed to load players: ${e.message}`)
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

<style>
.preview-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
</style>
