<template>
  <label :class="bem.b()">
    <span :class="bem.e('input')">
      <input
        type="checkbox"
        v-model="model"
        ref="inputRef"
        :disabled="disabled"
        :value="label"
        @change="handleChange"
      >
    </span>
    
    <span :class="bem.e('label')" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">
        {{ label }}
      </template>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { checkboxProps, checkboxEmits } from './checkbox'
import { createNamespace } from '@chengbai/utils/create';

const bem = createNamespace('checkbox');
const props = defineProps(checkboxProps);
const emit = defineEmits(checkboxEmits);
const inputRef = ref<HTMLInputElement>();

defineOptions({
  name: 'c-checkbox'
})

const model = computed({
    get() {
      return props.modelValue as string | boolean | number
    },
    set(val: string | boolean | number) {
      emit('update:modelValue', val)
    }
  }
)

function indeterminate(val: boolean) {
  inputRef.value!.indeterminate = val
}
function handleChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const value = target.checked ? true : false
  emit('change', value)
}
watch(() => props.indeterminate,indeterminate)
onMounted(() => {
  indeterminate(props.indeterminate);
})
</script>

<style scoped>

</style>