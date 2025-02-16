<template>
  <div :class="[bem.b(), bem.is('selected', isSelected), bem.is('disabled', node.disabled)]">
    <div
      :class="[bem.e('content')]"
      :style="{paddingLeft:`${node.level * 16}px`}"
    >
      <span
        :class="[
          'c-tree-node__expand-icon',
          { expanded: expanded && !node.isLeaf },
          bem.is('leaf', node.isLeaf)
        ]"
        @click="handleExpand()"
      >
        <c-icon size="20">
          <Switcher v-if="!isLoading"></Switcher>
          <Loading v-else></Loading>
        </c-icon>
      </span>
      <c-checkbox
        v-if="showCheckbox"
        :model-value="checked"
        :disabled="disabled"
        :indeterminate="indeterminate"
        @change="handleChange"
      ></c-checkbox>
      <span @click="handleSelected" :class="bem.e('label')">
        <CTreeNodeContent :node="node"></CTreeNodeContent>
      </span>
    </div>
  </div>
  
</template>

<script lang="ts" setup>
import Switcher from '@chengbai/components/internal-icon/Switcher.jsx';
import Loading from '@chengbai/components/internal-icon/Loading.jsx'
import { createNamespace } from '@chengbai/utils/create';
import { treeNodeEmits, treeNodeProps } from './tree';
import CTreeNodeContent from './tree-node-content.jsx';
import CCheckbox from '@chengbai/components/checkbox';
import { computed } from 'vue';
const bem = createNamespace('tree-node')
const props = defineProps(treeNodeProps)
const emit = defineEmits(treeNodeEmits)

function handleExpand() {
  emit('toggle', props.node);
}
// 是否loading
const isLoading = computed(() => {
  return props.loadingKeys!.has(props.node.key);
})
// 是否选中
const isSelected = computed(() => {
  return props.selectedKeys.includes(props.node.key);
})
function handleSelected() {
  if(props.node.disabled) return;
  emit('select', props.node)
}

function handleChange(val: boolean) {
  emit('check', props.node, val)
}

</script>

<style lang="scss">

</style>