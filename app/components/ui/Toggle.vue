<template>
  <label class="flex cursor-pointer items-center gap-3">
    <div class="relative">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        class="peer sr-only"
      />
      <div
        class="h-8 w-14 rounded-full border-3 border-black shadow-[3px_3px_0_black] transition-all peer-checked:bg-primary"
        :class="modelValue ? 'bg-primary' : 'bg-accent'"
      ></div>
      <div
        class="absolute left-1 top-1 h-6 w-6 rounded-full border-2 border-black bg-white shadow-[2px_2px_0_black] transition-all"
        :class="modelValue ? 'translate-x-6' : 'translate-x-0'"
      ></div>
    </div>
    <div class="flex flex-col">
      <span class="text-base font-bold text-gray-900">{{ label }}</span>
      <span class="text-sm text-gray-500">
        {{ modelValue ? activeText : inactiveText }}
      </span>
    </div>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  label: string
  activeText?: string
  inactiveText?: string
}

withDefaults(defineProps<Props>(), {
  activeText: 'Activé',
  inactiveText: 'Désactivé'
})

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>
