<template>
  <div>
    <label
      v-if="label"
      :for="inputId"
      class="mb-2 block font-semibold text-gray-700"
    >
      {{ label }}
      <span v-if="optional" class="text-gray-400">({{ optionalText }})</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :value="modelValue"
      @input="handleInput"
      class="focus:border-primary w-full border-2 border-gray-300 px-4 py-3 duration-300 focus:outline-none"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  optionalText?: string;
  modelValue?: string | number;
}>(), {
  optionalText: 'optionnel'
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  if (props.type === 'number') {
    const numValue = parseFloat(value);
    emit('update:modelValue', isNaN(numValue) ? 0 : numValue);
  } else {
    emit('update:modelValue', value);
  }
};

const inputId = computed(() => {
  return props.label
    ? props.label.toLowerCase().replace(/\s+/g, "-")
    : undefined;
});
</script>
