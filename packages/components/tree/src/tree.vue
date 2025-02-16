<template>
  <div :class="bem.b()">
    <c-virtual-list :items="flattenTree" :remain="8" :size="33">
      <template #default="{ node }">
        <z-tree-node
          :key="node.key"
          :node="node"
          :expanded="isExpanded(node)"
          :loadingKeys="loadingKeysRef"
          :selected-keys="selectedKeysRef"
          @select="handleSelect"
          @toggle="toggleExpand"
          :show-checkbox="showCheckbox"
          :checked="isChecked(node)"
          :disabled="isDisabled(node)"
          :indeterminate="isIndeterminate(node)"
          @check="toggleCheck"
        ></z-tree-node>
      </template>
    </c-virtual-list>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, provide, useSlots, onMounted } from 'vue';
import { Key, treeEmits, treeInjectKey, TreeNode, TreeOption, treeProps } from './tree';
import { createNamespace } from '@chengbai/utils/create';
import ZTreeNode from './treeNode.vue'
import CVirtualList from '@chengbai/components/virtual-list/index';
const bem = createNamespace('tree')

defineOptions({
  name: 'c-tree'
})
const props = defineProps(treeProps)
// props.data 格式化后放到tree中
const tree = ref<TreeNode[]>([])

function createOptions(key: string, label: string,children: string){
  return {
    getKey(node: TreeOption) {
      return node[key] as string
    },
    getLabel(node: TreeOption) {
      return node[label] as string
    },
    getChildren(node: TreeOption) {
      return node[children] as TreeOption[]
    }
  }
}

const treeOPtions = createOptions(
  props.keyField,
  props.labelField,
  props.childrenField
)
function createTree(data: TreeOption[], parent: TreeNode | null = null) {
  function traversal(data: TreeOption[], parent: TreeNode | null = null) {
    return data.map(node => {
      let children = treeOPtions.getChildren(node) || []
      const treeNode: TreeNode = {
        key: treeOPtions.getKey(node),
        label: treeOPtions.getLabel(node),
        children: [], //默认为空
        rawNode: node,
        level: parent ? parent.level + 1 : 0,
        disabled: !!node.disabled,
        isLeaf: node.isLeaf ?? children.length === 0,
        parentKey: parent?.key
      }
      if(children.length > 0) {
        // 有孩子再去递归 格式化为treeNode
        treeNode.children = traversal(children,treeNode)
      }
      return treeNode
    })
  }
  const result:TreeNode[] = traversal(data, parent)
  return result;
}
// 数据发生变化就调用格式化方法 一上来就格式化一次
watch(
  () => props.data,
  (data:TreeOption[]) => {
    tree.value = createTree(data)
  },
  { immediate: true }
)
// 将树拍平展开,点击还能实现展开操作
const expandedKeysSet = ref<Set<Key>>(new Set(props.defaultExpandedKeys));

const flattenTree = computed(() => {
  let expandNodes = expandedKeysSet.value // 需要展开的key
  
  let flattenNodes: TreeNode[] = []; // 拍平的树
  const nodes = tree.value || [] // 被格式化的树
  const stack: TreeNode[] = [] // 栈
  for(let i =  nodes.length - 1; i >= 0; i--) {
    stack.push(nodes[i])
  }
  while(stack.length > 0) {
    const node = stack.pop()
    if(!node) continue;
    flattenNodes.push(node);
    if(expandNodes.has(node.key)) {
      const children = node.children
      if(children.length > 0) {
        for(let i = children.length - 1; i >= 0; i--) {
          stack.push(children[i])
        }
      }
    }
  }

  return flattenNodes;
})
const loadingKeysRef = ref(new Set<Key>())
function triggerLoading(node: TreeNode) {
  if(!node.children.length && !node.isLeaf) {
    const loadingKeys = loadingKeysRef.value
    if(!loadingKeys.has(node.key)) {
      loadingKeys.add(node.key)
      const onLoad = props.onLoad
      if(onLoad) {
        onLoad(node).then((children) => {
          node.rawNode.children = children;
          node.children = createTree(children, node)
          loadingKeys.delete(node.key)
        })
      }
    }
  }
}

function isExpanded(node: TreeNode): boolean{
  return expandedKeysSet.value.has(node.key)
}
// 折叠
function collpase(node: TreeNode) {
  expandedKeysSet.value.delete(node.key)
}
// 展开
function expand(node: TreeNode) {
  expandedKeysSet.value.add(node.key)
  triggerLoading(node)
}
// 切换展开
function toggleExpand(node: TreeNode) {
    const expandKeys = expandedKeysSet.value;
    // 如果正在加载不能收起
    if(expandKeys.has(node.key) && !loadingKeysRef.value.has(node.key)) {
      collpase(node)
    } else {
      expand(node)
    }
}
// 实现选中节点
const emit = defineEmits(treeEmits)

const selectedKeysRef = ref<Key[]>([])

watch(
  () => props.selectedKeys,
  (value) => {
    if(value) {
      selectedKeysRef.value = value;
    }
  },
  { immediate: true }
)
function handleSelect(node:TreeNode) {
  let keys = Array.from(selectedKeysRef.value);
  if(!props.selectable) return;
  if(props.multiple) {
    const index = keys.findIndex(key => key === node.key)
    if(index > -1) {
      keys.splice(index,1)
    } else {
      keys.push(node.key)
    }
  } else {
    if(keys.includes(node.key)) {
      keys = []
    } else {
      keys = [node.key]
    }
  }
  emit('update:selectedKeys', keys)
}

provide(treeInjectKey, {
  slots: useSlots()
})


const checkedKeysRef = ref(new Set(props.defaultCheckedKeys));
function isChecked (node: TreeNode){
  return checkedKeysRef.value.has(node.key)
}
function isDisabled(node: TreeNode) {
  return !!node.disabled
}
const indeterminateKeysRef = ref<Set<Key>>(new Set());
function isIndeterminate(node: TreeNode) {
  return indeterminateKeysRef.value.has(node.key)
}
// 自上而下切换状态
function toggle(node: TreeNode, checked: boolean){
  if(!node) return
  const checkedKeys = checkedKeysRef.value
  if(checked) {
    // 选中去掉半选
    indeterminateKeysRef.value.delete(node.key)
  }
  // 维护当前key节点
  checkedKeys[checked ? 'add' : 'delete'](node.key)
  const children = node.children
  if(children) {
    children.forEach(childNode => {
      if(!childNode.disabled) {
        toggle(childNode, checked)
      }
    })
  }
}
function findNode(key: Key) {
  return flattenTree.value.find(node => node.key === key);
}
function updateCheckedKeys(node: TreeNode) {
  if(node.parentKey) {
    const parentNode = findNode(node.parentKey);
    if(parentNode) {
      let allChecked = true; // 默认儿子全选
      let hasChecked = false; // 儿子有没有选中
      let nodes = parentNode.children;
      for(let node of nodes) {
        if(checkedKeysRef.value.has(node.key)) {
          hasChecked = true;
        } else if(indeterminateKeysRef.value.has(node.key)) {
          allChecked = false
          hasChecked = true
        } else {
          allChecked = false
        }
      }
      if(allChecked) {
        checkedKeysRef.value.add(parentNode.key);
        indeterminateKeysRef.value.delete(parentNode.key);
      } else if (hasChecked) {
        checkedKeysRef.value.delete(parentNode.key)
        indeterminateKeysRef.value.add(parentNode.key)
      } else {
        checkedKeysRef.value.delete(parentNode.key)
        indeterminateKeysRef.value.delete(parentNode.key)
      }
      updateCheckedKeys(parentNode)
    }
  }
}
function toggleCheck(node: TreeNode, checked: boolean) {
  toggle(node,checked);
  updateCheckedKeys(node)
}

onMounted(() => {
  checkedKeysRef.value.forEach(key => {
    toggle(findNode(key)!, true);
  })
})

</script>
