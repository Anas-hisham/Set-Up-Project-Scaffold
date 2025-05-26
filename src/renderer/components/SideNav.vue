<template>
  <nav
    :class="[
      'p-4 transition-width duration-300 ease-in-out overflow-hidden w-full',
      navMode === 'full' ? fullWidthClass : miniWidthClass,
      displayMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black',
    ]"
  >
    <div class="flex justify-center items-center h-[calc(100vh-60px)] ">
      <ul style="list-style: none; padding: 0">
        <li
          v-for="(view, index) in views"
          :key="view.title"
          :class="[
            'rounded mb-2 px-4 py-2 cursor-pointer whitespace-nowrap',
            selectedIndex === index
              ? displayMode === 'dark'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-400 text-black'
              : '',
            navMode === 'mini' ? 'text-center px-2' : '',
          ]"
          @click="selected(index)"
          :title="navMode === 'mini' ? view.title : ''"
        >
          <!-- If mini mode, only show icon or first letter, else show full title -->
          <span v-if="navMode === 'mini'">{{ view.title.charAt(0) }}</span>
          <span v-else>{{ view.title }}</span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  views: Array,
  selectedIndex: Number,
  selected: Function,
  displayMode: String,
  navMode: String,
})

const fullWidthClass = 'col-span-3 lg:col-span-2 w-auto'
const miniWidthClass = 'w-16 col-span-1' // smaller width for mini mode
</script>

<style scoped>

</style>
