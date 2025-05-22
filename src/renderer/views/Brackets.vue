<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <h1 class="mt-12 text-4xl font-bold text-center text-white">Welcome to Stream Buddy</h1>
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
      />
    </div>
  </div>
  <!-- <div class="flex justify-center mb-6">
    <button
      class="px-6 py-3 bg-white text-black font-bold rounded-md cursor-pointer transition duration-300 hover:bg-gray-200"
      @click="saveTeams"
    >
      Save Teams
    </button>
  </div> -->
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TeamInputs from '../components/TeamInputs.vue'

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
    //  built-in JavaScript object that lets you read file contents from input type="file" (like images, PDFs, etc.) on the frontend
    const reader = new FileReader()
    reader.onload = () => {
      // reader.result: This contains the base64 string version of the file
      teams.value[index][type] = reader.result
    }
    /*
    This tells the FileReader to start reading the file.
    It converts the file into a base64 encoded string (a Data URL).
    When done, it triggers the onload function above.
    */
    reader.readAsDataURL(file)
  }
  /*
    Summary:

    Takes a file (like an image).
    Reads it using FileReader and converts it into a base64 string.
    When reading is finished, it updates the teams array (probably a Vue reactive object) at the given index and type with the file content.
  */
}

function triggerFileInput(refsArray, index) {
  refsArray[index]?.click()
}

// Save and Load Data
/*
async function saveTeams() {
  const result = await window.myAPI.saveTeams(JSON.stringify(teams.value))
  if (result.success) {
    alert('Teams saved!')
  } else {
    alert('Failed to save teams: ' + result.error)
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
*/

onMounted(() => {
  teamsLoop()
  // loadTeams()
})
</script>

<style>
.preview-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
</style>
