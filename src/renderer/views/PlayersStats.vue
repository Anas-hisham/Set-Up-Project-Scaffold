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
            v-model="player['Player Name']"
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
            v-model="player['Team Name']"
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
            v-model="player['Favourite Weapon']"
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
            v-model.number="player['Economy Score']"
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
            @change="handleFileChange($event, index, 'Hero Image')"
          />
          <span class="text-sm opacity-65">Hero Image</span>

          <div v-if="player['Hero Image']" class="flex items-center gap-2">
            <img
              :src="player['Hero Image']"
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
            v-model.number="player.Kills"
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
            v-model.number="player.Deaths"
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
            v-model.number="player.Assists"
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
    'Player Name': '',
    'Team Name': '',
    'Favourite Weapon': '',
    'Economy Score': '',
    'Hero Image': '',
    Kills: '',
    Deaths: '',
    Assists: '',
  },
])

const heroRefs = ref([])

function triggerFileInput(refs, index) {
  try {
    if (refs[index]) {
      refs[index].click()
    }
  } catch (err) {
    window.myAPI.logError(`Error triggering file input: ${err.message}`)
  }
}

function handleFileChange(event, index, type) {
  try {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        players.value[index][type] = reader.result
      }
      reader.readAsDataURL(file)
    }
  } catch (err) {
    window.myAPI.logError(`Error handling file change: ${err.message}`)
  }
}

function deleteHeroImage(index) {
  try {
    players.value[index]['Hero Image'] = null
  } catch (err) {
    window.myAPI.logError(`Error deleting hero image: ${err.message}`)
  }
}

async function savePlayers() {
  try {
    const playersToSave = JSON.parse(JSON.stringify(players.value))
    await window.myAPI.savePlayer(JSON.stringify(playersToSave))
  } catch (err) {
    window.myAPI.logError(`Error saving players: ${err.message}`)
  }
}

watch(
  players,
  () => {
    try {
      const plainPlayers = JSON.parse(JSON.stringify(players.value))
      window.myAPI.savePlayerCache(JSON.stringify(plainPlayers))
    } catch (err) {
      window.myAPI.logError(`Error saving player cache: ${err.message}`)
    }
  },
  { deep: true },
)

onMounted(async () => {
  try {
    const cached = await window.myAPI.loadPlayerCache()
    if (cached && Array.isArray(cached)) {
      players.value = cached
    }
  } catch (err) {
    window.myAPI.logError(`Error loading player cache: ${err.message}`)
  }
})
</script>
