<template>
  <div class="relative">
    <label v-if="label" class="mb-2 block font-semibold text-gray-700">
      {{ label }}
    </label>

    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        @blur="handleBlur"
        class="w-full border-2 border-gray-300 px-4 py-3 duration-300 focus:border-primary focus:outline-none"
      />

      <div
        v-if="showSuggestions && filteredItems.length > 0"
        class="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto border-2 border-gray-300 bg-white shadow-lg"
      >
        <button
          v-for="item in filteredItems"
          :key="item[itemValue]"
          type="button"
          @mousedown.prevent="selectItem(item)"
          class="w-full border-b border-gray-100 px-4 py-2 text-left transition-colors hover:bg-secondary/10"
        >
          <p class="font-medium">{{ item[itemLabel] }}</p>
          <p v-if="itemSubLabel" class="text-sm text-gray-600">
            {{ item[itemSubLabel] }}
          </p>
        </button>
      </div>

      <div
        v-if="showSuggestions && searchQuery && filteredItems.length === 0"
        class="absolute z-10 mt-1 w-full border-2 border-gray-300 bg-white px-4 py-3 text-gray-500 shadow-lg"
      >
        Aucun résultat
      </div>
    </div>

    <div v-if="multiple && selectedItems.length > 0" class="mt-3 flex flex-wrap gap-2">
      <div
        v-for="item in selectedItems"
        :key="item[itemValue]"
        class="inline-flex items-center gap-2 rounded bg-secondary/20 px-3 py-1.5"
      >
        <span class="font-medium">{{ item[itemLabel] }}</span>
        <button
          type="button"
          @click="removeItem(item)"
          class="flex items-center text-gray-600 hover:text-red-600"
        >
          <Icon name="mdi:close" size="16" />
        </button>
      </div>
    </div>

    <div v-else-if="!multiple && selectedItem" class="mt-2">
      <div
        class="inline-flex items-center gap-2 rounded bg-secondary/20 px-3 py-1.5"
      >
        <span class="font-medium">{{ selectedItem[itemLabel] }}</span>
        <button
          type="button"
          @click="clearSelection"
          class="flex items-center text-gray-600 hover:text-red-600"
        >
          <Icon name="mdi:close" size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
interface Props {
  items: T[]
  itemLabel: string
  itemSubLabel?: string
  itemValue: string
  label?: string
  placeholder?: string
  modelValue: T | T[] | null
  multiple?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  itemLabel: 'name',
  itemValue: 'id',
  label: '',
  placeholder: 'Rechercher...',
  modelValue: null,
  multiple: false
})

const emit = defineEmits<{
  'update:modelValue': [value: T | T[] | null]
}>()

const searchQuery = ref("");
const showSuggestions = ref(false);
const selectedItem = ref(props.multiple ? null : props.modelValue);
const selectedItems = ref(props.multiple ? (props.modelValue || []) : []);

watch(
  () => props.modelValue,
  (newVal) => {
    if (props.multiple) {
      selectedItems.value = newVal || [];
    } else {
      selectedItem.value = newVal;
      if (newVal) {
        searchQuery.value = "";
      }
    }
  },
);

watch(searchQuery, (newVal) => {
  if (newVal && newVal.trim().length > 0) {
    showSuggestions.value = true;
  } else {
    showSuggestions.value = false;
  }
});

const selectedItemIds = computed(() => {
  if (props.multiple) {
    return selectedItems.value.map((item) => item[props.itemValue]);
  }
  return selectedItem.value ? [selectedItem.value[props.itemValue]] : [];
});

const filteredItems = computed(() => {
  let availableItems = props.items.filter(
    (item) => !selectedItemIds.value.includes(item[props.itemValue])
  );

  if (!searchQuery.value) return availableItems;

  const query = searchQuery.value.toLowerCase().trim();
  return availableItems.filter((item) =>
    item[props.itemLabel].toLowerCase().includes(query),
  );
});

const selectItem = (item) => {
  if (props.multiple) {
    selectedItems.value.push(item);
    emit("update:modelValue", selectedItems.value);
  } else {
    selectedItem.value = item;
    emit("update:modelValue", item);
  }
  searchQuery.value = "";
  showSuggestions.value = false;
};

const removeItem = (item) => {
  const index = selectedItems.value.findIndex(
    (i) => i[props.itemValue] === item[props.itemValue]
  );
  if (index !== -1) {
    selectedItems.value.splice(index, 1);
    emit("update:modelValue", selectedItems.value);
  }
};

const clearSelection = () => {
  selectedItem.value = null;
  searchQuery.value = "";
  emit("update:modelValue", null);
};

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};
</script>
