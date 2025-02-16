<template>
  <div class="item" :data-index="source.index">
    <div class="head">
      <span>{{ source.index }}</span>
      <span>{{ source.name }}</span>
    </div>
    <div class="body" :style="{ fontSize: '18px'}">
      <span>{{ source.desc }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  source: {
    type: Object,
    default: () => ({})
  }
})
</script>