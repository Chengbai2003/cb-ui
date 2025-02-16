<template>
  <div ref="virtualItem">
    <component
      :is="props.component"
      :source="props.source"
    ></component>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUpdated, ref } from 'vue';
import { virtualItemProps } from './virtual-list';

defineOptions({
  name: 'virtual-item'
})
const props = defineProps(virtualItemProps);
const emit = defineEmits(['itemResize']);

const virtualItem = ref<HTMLElement | null>(null);

function dispatchEvent() {
  emit('itemResize', props.uniqueKey, virtualItem.value!.offsetHeight)
}
onMounted(dispatchEvent)
onUpdated(dispatchEvent)
</script>