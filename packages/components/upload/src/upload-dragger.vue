<template>
  <div @dragover.prevent="onDragover" @dragleave.prevent="$event => isOver = false" @drop.prevent="onDrop">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isOver = ref(false)
const onDragover = function(event: DragEvent) {
  isOver.value = true
}
const emit = defineEmits({})
const onDrop = function(event: DragEvent) {
  event.stopPropagation()
  emit('file', Array.from(event.dataTransfer!.files))
}
</script>