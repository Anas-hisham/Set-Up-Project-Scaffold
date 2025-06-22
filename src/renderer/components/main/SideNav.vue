<template>
  <nav
    :class="[
      'side-nav transition-all duration-300 flex flex-col  relative items-center',
      displayMode === 'dark' ? 'bg-gray-800 ' : 'bg-gray-50 border-gray-200',
    ]"
  >
    <div class="flex justify-center items-center h-[calc(100vh-60px)] fixed">
      <ul class="space-y-2 p-2 w-fit">
        <li v-for="view in views" :key="view.path">
          <div v-if="view.path !== '/welcome' && view.path !== '/settings'">
            <router-link
              :to="view.path"
              :class="[
                'flex items-center p-2 rounded transition-colors',
                navMode === 'full' ? 'justify-start' : 'justify-center',
                displayMode === 'dark' ? 'text-white' : 'text-gray-900',
                $route.path === view.path ? 'bg-blue-600' : '',
              ]"
              :title="navMode === 'mini' ? view.title : ''"
            >
              <span v-if="navMode === 'full'">{{ view.title }}</span>
              <span v-else class="font-bold">{{ getFirstLetter(view.title) }}</span>
            </router-link>
          </div>
        </li>
      </ul>
      <div
        class=" p-2 border-t absolute bottom-5"
        :class="displayMode === 'dark' ? 'border-gray-700' : 'border-gray-200'"
      >
        <router-link
          to="/settings"
          :class="[
            'flex items-center p-2 rounded transition-colors ',
            displayMode === 'dark' ? 'text-white' : 'text-gray-900',
            $route.path === '/settings' ? 'bg-blue-600 text-white' : '',
          ]"
          :title="navMode === 'mini' ? 'Settings' : ''"
        >
          <i class="pi pi-cog" ></i>

          <span class="ml-2" v-if="navMode === 'full'">Settings</span>
          <span v-else class="font-bold"></span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

defineProps({
  views: Array,
  navMode: String,
  displayMode: String,
})

const getFirstLetter = (title) => {
  return title && title.length > 0 ? title.charAt(0) : '?'
}
</script>
