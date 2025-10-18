<template>
  <div class="mb-4 flex items-center justify-between pr-6">
    <div class="h-8 w-48 animate-pulse rounded bg-gray-300"></div>
    <div class="flex gap-2">
      <div class="h-10 w-10 animate-pulse rounded-full bg-gray-300"></div>
      <div class="h-10 w-10 animate-pulse rounded-full bg-gray-300"></div>
    </div>
  </div>

  <div class="overflow-hidden pr-6">
    <div class="flex gap-4">
      <div
        v-for="index in 4"
        :key="index"
        class="h-[200px] flex-shrink-0 animate-pulse rounded-lg bg-gray-300"
        :class="{
          'w-[calc((100%-1rem)/2)]': true,
          'md:w-[calc((100%-2rem)/3)]': true,
          'lg:w-[calc((100%-3rem)/4)]': true
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
</script>
