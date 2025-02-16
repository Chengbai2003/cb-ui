<template>
  <button
    :class="[
      bem.b(),
      bem.m(type),
      bem.m(size),
      bem.is('round', round),
      bem.is('loading', loading),
      bem.is('disabled', disabled)
    ]"
    :type="nativeType"
    :disabled="disabled || loading"
    @click="emitClick"
    @mousedown="emitMousedown"
  >
    <template v-if="iconPlacement === 'left' && (loading || slots.icon)">
      <c-Icon>
        <Loading v-if="loading"></Loading>
        <template v-else-if="slots.icon">
          <component :is="slots.icon"></component>
        </template>
      </c-Icon>
    </template>
    <slot></slot>
    <template v-if="iconPlacement === 'right' && (loading || slots.icon)">
      <c-Icon>
        <Loading v-if="loading"></Loading>
        <template v-else-if="slots.icon">
          <component :is="slots.icon"></component>
        </template>
      </c-Icon>
    </template>
  </button>
</template>

<script setup lang="ts">
import { createNamespace } from '@chengbai/utils/create';
import { buttonEmits, buttonProps } from './button';
import Loading from '@chengbai/components/internal-icon/Loading';
import CIcon from '@chengbai/components/icon'
import { useSlots } from 'vue';

const bem = createNamespace('button');
defineOptions({
  name: 'c-button',
  inheritAttrs: false
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps(buttonProps);
const emit = defineEmits(buttonEmits)
const slots = useSlots();

function emitClick(e: MouseEvent) {
  emit('click', e)
}
function emitMousedown(e: MouseEvent) {
  emit('mousedown', e);
}

</script>

<style scoped>

</style>