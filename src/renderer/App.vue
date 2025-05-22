<template>
  <h1 class="mt-12 text-4xl font-bold text-center text-white">Welcome to Stream Buddy</h1>
  <div class="flex justify-center py-10 px-4">
    <div class="w-full  grid gap-2">
      <div
        v-for="(team, index) in teams"
        :key="index"
        class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 items-center gap-4 p-4 rounded-lg"
      >
        <!-- Team Image -->
        <div
          class="flex justify-between lg:col-span-2 bg-[#1f2937] px-3 h-14 rounded-md items-center gap-3 text-white"
        >
          <input
            v-if="!team.image"
            type="file"
            class="hidden"
            :ref="(el) => (imageRefs[index] = el)"
            @change="handleFileChange($event, index, 'image')"
          />

          <span class="text-sm">Team Image</span>
          <div v-if="team.image" class="w-12 h-12 rounded">
            <img :src="team.image" alt="Team" class="w-full h-full object-cover" />
          </div>
          <button
            v-else
            class="text-green-400 font-semibold cursor-pointer"
            @click="() => triggerFileInput(imageRefs, index)"
          >
            + ADD
          </button>
        </div>

        <!-- Team Flag -->
        <div
          class="flex justify-between lg:col-span-2 bg-[#1f2937] px-4 h-14 rounded-md items-center gap-3 text-white"
        >
          <input
            v-if="!team.flag"
            type="file"
            class="hidden"
            :ref="(el) => (flagRefs[index] = el)"
            @change="handleFileChange($event, index, 'flag')"
          />
          <span class="text-sm">Team Flag</span>
          <div v-if="team.flag" class="w-12 h-12 rounded overflow-hidden">
            <img :src="team.flag" alt="Flag" class="w-full h-full object-cover" />
          </div>
          <button
            v-else
            class="text-green-400 font-semibold cursor-pointer"
            @click="() => triggerFileInput(flagRefs, index)"
          >
            + ADD
          </button>
        </div>

        <!-- Team Name -->
        <div class="text-white px-4 py-3 rounded-md border relative">
          <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"></i>
          <input
            type="text"
            v-model="team.name"
            maxlength="13"
            placeholder="Team Name"
            class="outline-hidden pl-5 w-full"
          />
        </div>

        <div class="text-white px-4 py-3 rounded-md border relative">
          <i class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2 text-white"></i>

          <!-- Team Score -->
          <input
            type="number"
            v-model.number="team.score"
            placeholder="Team Score"
            class="outline-hidden pl-5 w-full"
          />
        </div>
      </div>
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
body {
  background-color: #2a3444;
}
.preview-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
</style>
