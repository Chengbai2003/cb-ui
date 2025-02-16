import { computed, defineComponent, inject } from 'vue';
import { treeInjectKey, treeNodeContentProps } from './tree';
export default defineComponent({
  name:'CTreeNodeContent',
  props: treeNodeContentProps,
  setup(props) {
    const treeContext = inject(treeInjectKey)
    const node = computed(() => props.node);
    return () => {
      return treeContext?.slots.default
        ? treeContext?.slots.default({ node: node.value })
        : node?.value.label
    }
  }
})