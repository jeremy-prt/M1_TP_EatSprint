<template>
  <label class="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 transition-all hover:border-secondary hover:bg-white">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      class="checkbox-custom"
    />
    <span class="text-base font-semibold text-gray-700">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  label: string
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.checkbox-custom {
  appearance: none;
  width: 24px;
  height: 24px;
  border: 3px solid #374151;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
  box-shadow: 2px 2px 0 black;
}

.checkbox-custom:hover {
  border-color: #fb923c;
}

.checkbox-custom:checked {
  background-color: #fb923c;
  border-color: #fb923c;
}

.checkbox-custom:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.checkbox-custom:focus {
  outline: none;
}
</style>
