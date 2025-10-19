<template>
  <div>
    <label
      v-if="label"
      :for="inputId"
      class="mb-2 block font-semibold text-gray-700"
    >
      {{ label }}
      <span v-if="optional" class="text-gray-400">(optionnel)</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      class="focus:border-primary w-full border-2 border-gray-300 px-4 py-3 duration-300 focus:outline-none"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  modelValue?: string;
}>();

defineEmits<{
  "update:modelValue": [value: string];
}>();

const inputId = computed(() => {
  return props.label
    ? props.label.toLowerCase().replace(/\s+/g, "-")
    : undefined;
});
</script>
