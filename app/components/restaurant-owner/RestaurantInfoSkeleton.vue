<template>
  <div class="-skew-x-3 flex h-full flex-col overflow-hidden bg-white shadow-[8px_8px_0_#fb923c]">
    <div class="border-b-2 border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="h-8 w-64 animate-pulse rounded bg-gray-300"></div>
        <div class="h-10 w-24 animate-pulse rounded bg-gray-300"></div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-6">
      <div class="mb-6 h-48 w-full animate-pulse rounded bg-gray-300"></div>

      <div class="grid gap-6 md:grid-cols-2">
        <div v-for="i in 8" :key="i">
          <div class="mb-2 h-4 w-24 animate-pulse rounded bg-gray-300"></div>
          <div class="h-6 w-full animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  </div>
</template>
