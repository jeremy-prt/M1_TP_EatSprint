<template>
  <div class="my-12 w-full px-6">
    <div class="mx-auto max-w-3xl">
      <div class="relative">
        <div
          class="-skew-x-12 overflow-hidden bg-white/70 shadow-[6px_6px_0_#fb923c] backdrop-blur-xs transition-all duration-300 focus-within:shadow-[8px_8px_0_#fb923c] hover:shadow-[8px_8px_0_#fb923c]"
        >
          <div class="flex skew-x-12 items-center gap-3 px-5 py-4">
            <Icon
              name="mdi:magnify"
              size="28"
              class="text-secondary flex-shrink-0"
            />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('restaurants.search.placeholder')"
              class="text-secondary placeholder:text-secondary/50 w-full bg-transparent text-lg font-medium outline-none"
            />
          </div>
        </div>

        <!-- <div
          v-if="searchQuery && resultCount !== null"
          class="absolute top-full left-1/2 mt-3 -translate-x-1/2 text-sm font-medium text-gray-600"
        >
          {{ resultCount }} restaurant{{ resultCount > 1 ? "s" : "" }} trouvé{{
            resultCount > 1 ? "s" : ""
          }}
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const searchQuery = defineModel<string>({ default: "" });
</script>
