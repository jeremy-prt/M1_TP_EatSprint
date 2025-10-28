<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed right-8 bottom-8 z-50 flex flex-col gap-3"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto -skew-x-3 overflow-hidden shadow-[4px_4px_0_black] transition-all duration-300"
          :class="getToastClass(toast.type)"
        >
          <div class="flex skew-x-3 items-center gap-3 px-5 py-4">
            <Icon :name="getIcon(toast.type)" size="24" class="flex-shrink-0" />
            <p class="flex-1 font-medium">{{ toast.message }}</p>
            <button
              @click="removeToast(toast.id)"
              class="relative top-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/10"
            >
              <Icon name="mdi:close" size="18" />
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from "~/composables/useToast";

const { toasts, removeToast } = useToast();

const getToastClass = (type: string) => {
  switch (type) {
    case "success":
      return "bg-green-500 text-white";
    case "error":
      return "bg-red-500 text-white";
    case "warning":
      return "bg-accent text-white";
    case "info":
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return "mdi:check-circle";
    case "error":
      return "mdi:alert-circle";
    case "warning":
      return "mdi:alert";
    case "info":
      return "mdi:information";
    default:
      return "mdi:information";
  }
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px) skewX(-3deg);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px) skewX(-3deg);
}
</style>
