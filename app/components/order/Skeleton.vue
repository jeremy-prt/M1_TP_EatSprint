<template>
  <div class="space-y-6">
    <div
      v-for="index in 3"
      :key="index"
      class="-skew-x-3 border-4 border-black bg-white/70 shadow-[6px_6px_0_black] backdrop-blur-xs"
    >
      <div class="skew-x-3 p-6">
        <div
          class="mb-4 flex items-center justify-between border-b border-gray-200 pb-4"
        >
          <div class="flex-1 space-y-2">
            <div class="h-6 w-32 animate-pulse rounded bg-gray-300"></div>
            <div class="h-4 w-48 animate-pulse rounded bg-gray-300"></div>
          </div>
          <div class="space-y-2 text-right">
            <div class="h-6 w-24 animate-pulse rounded bg-gray-300"></div>
            <div class="h-8 w-20 animate-pulse rounded bg-gray-300"></div>
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="itemIndex in 3"
            :key="itemIndex"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div class="h-4 w-8 animate-pulse rounded bg-gray-300"></div>
              <div class="h-4 w-40 animate-pulse rounded bg-gray-300"></div>
            </div>
            <div class="h-4 w-16 animate-pulse rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
