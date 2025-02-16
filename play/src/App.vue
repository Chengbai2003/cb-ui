<script setup lang="ts">
import { DefineComponent, ref } from 'vue';
import { Random } from 'mockjs';
import Item from './Item.vue';

interface DataType {
  id: number;
  name: string;
  desc: string;
  index: number;
}

const totalCount = 100;
const data:Array<DataType> = [];

let index = 0;
while(index++ !== totalCount) {
  data.push({
    id: index,
    name: Random.name(),
    desc: Random.csentence(20, 120),
    index
  });
}
const items = ref(data);
</script>


<template>
  <c-virtual-scroll-list
    class="virtual-list"
    :data-sources="items"
    data-key="id"
    :keeps="30"
    :estimate-size="60"
    :dataComponent="(Item as DefineComponent<{},{},any>)"
  ></c-virtual-scroll-list>
</template>

<style scoped lang="scss">
.virtual-list {
  width: 100%;
  height: 500px;
  overflow-y: auto;
  border: 3px solid red;
}
</style>