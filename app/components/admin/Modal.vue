<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        @click.self="close"
      >
        <div
          class="relative w-full max-w-2xl bg-white shadow-[12px_12px_0_#fb923c]"
          @click.stop
        >
          <div
            class="flex items-center justify-between border-b-2 border-gray-200 px-6 py-4"
          >
            <h2 class="text-primary text-2xl font-bold">{{ title }}</h2>
            <button
              @click="close"
              class="bg-secondary inline-flex items-center justify-center rounded-full p-2 text-white shadow-[2px_2px_0_black] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_black]"
            >
              <Icon name="mdi:close" size="20" />
            </button>
          </div>

          <div class="max-h-[75vh] overflow-y-auto px-6 py-6">
            <slot></slot>
          </div>

          <div v-if="$slots.footer" class="px-6 py-4">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title: string
}

withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const close = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative {
  transform: scale(0.9);
}

.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>
