<template>
  <div class="space-y-12">
    <div v-for="index in 3" :key="index">
      <div class="relative left-12 mb-6 h-8 w-48 animate-pulse rounded bg-gray-300"></div>

      <div class="pr-6">
        <div class="grid grid-cols-1 gap-6 pl-5 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="cardIndex in 4"
          :key="cardIndex"
          class="relative h-[200px] -skew-x-12 overflow-hidden bg-white shadow-[6px_6px_0_#fb923c]"
        >
          <div class="absolute inset-0 animate-pulse bg-gray-300"></div>

          <div class="absolute top-4 left-4">
            <div class="h-7 w-16 animate-pulse rounded bg-gray-400"></div>
          </div>

          <div class="absolute bottom-4 left-4">
            <div class="h-6 w-2/3 animate-pulse rounded bg-gray-400"></div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
