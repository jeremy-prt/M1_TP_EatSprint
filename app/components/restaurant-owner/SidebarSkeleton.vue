<template>
  <div
    class="flex h-[calc(100vh-var(--spacing-header)-4rem)] w-64 -skew-x-3 flex-col bg-white shadow-[8px_8px_0_#fb923c]"
  >
    <nav class="flex-1 overflow-y-auto p-4">
      <ul class="space-y-4">
        <li v-for="i in 3" :key="i">
          <div
            class="flex -skew-x-3 items-center gap-3 px-4 py-3 shadow-[4px_4px_0_black]"
          >
            <div class="h-6 w-6 animate-pulse rounded bg-gray-300"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 w-3/4 animate-pulse rounded bg-gray-300"></div>
              <div class="h-3 w-1/2 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>
