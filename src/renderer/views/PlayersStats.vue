<template>
  <h1
    class="mt-12 text-4xl font-bold text-center"
    :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
  >
    Players Stats
  </h1>
  <div class="flex justify-center py-10 px-4">
    <div class="w-full grid gap-4">
      <div v-for="(player, index) in players" :key="index" class="grid gap-7 p-4 -lg">
        <!-- Player Name -->
        <div
          class="px-4 py-3 border relative"
          :class="
            props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
          "
        >
          <i
            class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
            :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
          ></i>
          <input
            type="text"
            v-model="player.name"
            placeholder="Player Name"
            class="outline-hidden pl-5 w-full"
            :class="
              props.displayMode === 'dark'
                ? 'placeholder-white text-white'
                : 'placeholder-black text-black'
            "
          />
        </div>

        <!-- Team Name -->
        <div
          class="px-4 py-3 border relative"
          :class="
            props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
          "
        >
          <i
            class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
            :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
          ></i>
          <input
            type="text"
            v-model="player.team"
            placeholder="Team Name"
            class="outline-hidden pl-5 w-full"
            :class="
              props.displayMode === 'dark'
                ? 'placeholder-white text-white'
                : 'placeholder-black text-black'
            "
          />
        </div>

        <!-- Favorite Weapon -->
        <div
          class="px-4 py-3 border relative"
          :class="
            props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
          "
        >
          <i
            class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
            :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
          ></i>
          <input
            type="text"
            v-model="player.weapon"
            placeholder="Favorite Weapon"
            class="outline-hidden pl-5 w-full"
            :class="
              props.displayMode === 'dark'
                ? 'placeholder-white text-white'
                : 'placeholder-black text-black'
            "
          />
        </div>

        <!-- Economy Score -->
        <div
          class="px-4 py-3 border relative"
          :class="
            props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
          "
        >
          <i
            class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
            :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
          ></i>
          <input
            type="number"
            v-model.number="player.economy"
            placeholder="Economy Score"
            class="outline-hidden pl-5 w-full"
            :class="
              props.displayMode === 'dark'
                ? 'placeholder-white text-white'
                : 'placeholder-black text-black'
            "
          />
        </div>
        <!-- Hero Image -->
        <div
          class="flex justify-between border px-4 h-14 items-center gap-3"
          :class="
            props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
          "
        >
          <input
            type="file"
            class="hidden"
            :ref="(el) => (heroRefs[index] = el)"
            @change="handleFileChange($event, index, 'hero')"
          />
          <span class="text-sm opacity-65">Hero Image</span>

          <div v-if="player.hero" class="flex items-center gap-2">
            <img
              :src="player.hero"
              alt="Hero"
              class="w-12 h-12 object-cover cursor-pointer rounded"
              @click="() => triggerFileInput(heroRefs, index)"
              title="Click to change image"
            />
            <button
              type="button"
              class="text-red-500 font-semibold hover:underline"
              @click="() => deleteHeroImage(index)"
              title="Delete image"
            >
              Delete
            </button>
          </div>

          <button
            v-else
            class="font-semibold cursor-pointer"
            :class="props.displayMode === 'dark' ? 'text-green-400' : 'text-green-600'"
            @click="() => triggerFileInput(heroRefs, index)"
          >
            + ADD
          </button>
        </div>

        <!-- Kills -->
        <div
          class="px-4 py-3 border relative"
          :class="
            props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
          "
        >
          <i
            class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
            :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
          ></i>
          <input
            type="number"
            v-model.number="player.kills"
            placeholder="Kills"
            class="outline-hidden pl-5 w-full"
            :class="
              props.displayMode === 'dark'
                ? 'placeholder-white text-white'
                : 'placeholder-black text-black'
            "
          />
        </div>

        <!-- Deaths -->
        <div
          class="px-4 py-3 border relative"
          :class="
            props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
          "
        >
          <i
            class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
            :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
          ></i>
          <input
            type="number"
            v-model.number="player.deaths"
            placeholder="Deaths"
            class="outline-hidden pl-5 w-full"
            :class="
              props.displayMode === 'dark'
                ? 'placeholder-white text-white'
                : 'placeholder-black text-black'
            "
          />
        </div>

        <!-- Assists -->
        <div
          class="px-4 py-3 border relative"
          :class="
            props.displayMode === 'dark' ? 'text-white border-white' : 'text-black border-black'
          "
        >
          <i
            class="pi pi-pencil absolute left-2.5 top-1/2 -translate-y-1/2"
            :class="props.displayMode === 'dark' ? 'text-white' : 'text-black'"
          ></i>
          <input
            type="number"
            v-model.number="player.assists"
            placeholder="Assists"
            class="outline-hidden pl-5 w-full"
            :class="
              props.displayMode === 'dark'
                ? 'placeholder-white text-white'
                : 'placeholder-black text-black'
            "
          />
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-center mt-3">
    <button
      @click="savePlayers"
      class="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
    >
      Save Players
    </button>
  </div>
</template>



<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  displayMode: {
    type: String,
    default: 'light',
  },
})

const players = ref([
  {
    name: '',
    team: '',
    weapon: '',
    economy: null,
    hero: null,
    kills: null,
    deaths: null,
    assists: null,
  },
])

const heroRefs = ref([])

function triggerFileInput(refs, index) {
  if (refs[index]) {
    refs[index].click()
  }
}

function handleFileChange(event, index, type) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      players.value[index][type] = reader.result // base64 sent to main process
      console.log(reader.result);

    }
    reader.readAsDataURL(file)
  }
}

function deleteHeroImage(index) {
  players.value[index].hero = null
}

async function savePlayers() {
  try {
const result = await window.myAPI.savePlayer(JSON.stringify(players.value))
    if (result.success) {
      alert('Players saved successfully!')
    } else {
      alert('Failed to save players: ' + result.error)
    }
  } catch (err) {
    alert('Error saving players: ' + err.message)
  }
}

watch(
  players,
  () => {
    const plainPlayers = JSON.parse(JSON.stringify(players.value))
    window.myAPI.savePlayerCache(JSON.stringify(plainPlayers))
  },
  { deep: true },
)

onMounted(async () => {
  const cached = await window.myAPI.loadPlayerCache()
  if (cached && Array.isArray(cached)) {
    players.value = cached
    console.log(players.value)
  }
})
</script>
