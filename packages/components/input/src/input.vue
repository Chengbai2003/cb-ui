<template>
  <div :class="[bem.b()]">
    <div :class="bem.e('group')">
      <div v-if="slots.prepend" :class="bem.be('group','prepend')">
        <slot name="prepend"></slot>
      </div>
      <div :class="[bem.e('wrapper')]">
        <span v-if="slots.prefix">
          <slot name="prefix"></slot>
        </span>
        <!-- 需要显示密码 且当前是普通还是密码 -->
        <input
          :type="showPassword ? (passwordVisible ? 'text' : 'password'): type"
          v-bind="attrs"
          :class="bem.e('inner')"
          ref="inputRef"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          @input="handleInput"
          @change="handleChange"
          @blur="handleBlur"
          @focus="handleFocus"
        >
        <span v-if="slots.suffix || showPwdVisible || showClear">
          <c-icon v-if="showPwdVisible" @click="handlePasswordVisible" style="line-height: 16px;font-weight: bold;">e</c-icon>
          <c-icon v-else-if="showClear" @click="handleClear" style="line-height: 16px;font-weight: bold;">X</c-icon>
          <slot name="suffix" v-else></slot>
        </span>
      </div>
      <div v-if="slots.append" :class="bem.be('group','append')">
        <slot name="append"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@chengbai/utils/create';
import { useAttrs, useSlots, watch, ref, onMounted, nextTick, computed, inject } from 'vue';
import { inputEmits, inputProps } from './input';
import { formItemContextKey } from '@chengbai/components/form/src/form-item';

const formItemContext = inject(formItemContextKey)
defineOptions({
  name:'c-input',
  inheritAttrs: false
})

const bem = createNamespace('input');
const props = defineProps(inputProps);
const emit = defineEmits(inputEmits);

const slots = useSlots();
const attrs = useAttrs
const inputRef = ref<HTMLInputElement | null>(null)

// 监控val变化,重新赋值
watch(
  () => props.modelValue, 
  () => {
    formItemContext?.validate('change').catch(() => {})
    setNativeInputValue();
})
const setNativeInputValue = () => {
  const ele = inputRef.value
  if (!ele) {
    return;
  }
  ele.value = String(props.modelValue);
}

const passwordVisible = ref(false);
const handlePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value;
  focus()
}
const focus = async () => {
  await nextTick();
  inputRef.value?.focus()
}
const showPwdVisible = computed(() => {
  return props.modelValue && props.showPassword && !props.disabled && !props.readonly
})
const showClear = computed(() => {
  return props.modelValue && props.clearable && !props.disabled && !props.readonly
})
const handleClear = () => {
  emit('input', '')
  emit('update:modelValue', '')
  emit('clear')
  focus()
}

onMounted(() => {
  // 加载完毕设置一次值
  setNativeInputValue()
})

function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  emit('input', value)
  emit('update:modelValue', value)
}

function handleChange(e: Event){
  emit('change', (e.target as HTMLInputElement).value)
}
function handleBlur(e: FocusEvent) {
  formItemContext?.validate('blur')
  emit('blur', e)
}
function handleFocus(e: FocusEvent) {
  emit('focus', e)
}
</script>

<style scoped>

</style>