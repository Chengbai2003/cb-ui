<template>
  <div @scroll="handleScroll" ref="virtualRef">
    <div :style="paddingStyle" class="item-list">
      <VirtualItem
        v-for="dataSource in renderedDataSources"
        :key="dataSource[props.dataKey]"
        :uniqueKey="dataSource[props.dataKey]"
        :component="props.dataComponent"
        :source="dataSource"
        @itemResize="handleItemResize"
      ></VirtualItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { RangeOtions, updateType, VirtualOptions, virtualProps } from './virtual-list';
import VirtualItem from './virtual-item.vue';

defineOptions({
  name: 'c-virtual-scroll-list',
})
let virtualRef = ref<HTMLElement | null>(null)
const props = defineProps(virtualProps)
const range = ref<RangeOtions | null>(null)

const paddingStyle = computed(() => {
  return {
    padding: `${range.value!.padFront}px 0 ${range.value!.padBehind}px`,
  }
})

const enum CALC_TYPE {
  INIT = 'INIT',
  FIXED = 'FIXED',
  DYNAMIC = 'DYNAMIC',
}
let virtual = ref()
const update: updateType = newRange => {
  range.value = newRange
}
const getUniqueIdFromDataSources = (): string[] => {
  const { dataSources, dataKey } = props
  return dataSources.map(dataSources => dataSources[dataKey])
}
function initVirtual(param: VirtualOptions, update: updateType) {
  let offsetValue = 0
  const sizes = new Map<string | number, number>();
  let calcType = CALC_TYPE.INIT; // 区分动态高度还是固定高度
  let fixedSizeVal = 0; // 默认值是0
  let firstRangeAvg = 0; // 动态高度的平均值
  const range: RangeOtions = {
    start: 0,
    end: 0,
    padFront: 0,
    padBehind: 0,
  }

  function getEstimateSize() {
    // 优化平均值
    return calcType === CALC_TYPE.FIXED ? fixedSizeVal : firstRangeAvg || param.estimateSize
  }
  function getIndexOffset(idx: number) {
    if(!idx) return 0;
    let offset = 0;
    for(let i = 0; i < idx; i++) {
      const size = sizes.get(param.uniqueIds[i]);
      offset += typeof size === 'number'? size : getEstimateSize()
    }
    return offset
  }
  function getPadFront() {
    // 准确计算 上偏移量
    if(calcType === CALC_TYPE.FIXED) {
      return fixedSizeVal * range.start
    } else {
      // 动态高度的上偏移量 —— 将滚动过后的像素累加一边
      return getIndexOffset(range.start)
    }
  }
  function getPadBehind() {
    return getEstimateSize() * (param.uniqueIds.length - 1 - range.end)
  }
  function updateRange(start: number, end: number) {
    range.start = start
    range.end = end
    range.padFront = getPadFront()
    range.padBehind = getPadBehind()
    update({ ...range })
  }
  function checkRange(start: number, end: number) {
    const total = param.uniqueIds.length;
    const keeps = param.keeps;
    if(total < keeps) {
      start = 0;
      end = total - 1
    } else if(end - start + 1 < keeps) {
      start = end - keeps + 1;
    }
    updateRange(start, end)
  }

  function getEndByStart(start: number) {
    const computeEnd = start + param.keeps - 1;
    const end = Math.min(computeEnd, param.uniqueIds.length - 1);
    return end
  }
  function getScrollOvers() { // 获取划过的个数
    if(calcType === CALC_TYPE.FIXED) {
      return Math.floor(offsetValue / getEstimateSize())
    } else {
      // 获取最接近的滚动的那一项，计算每一项的偏移量，看与哪一项最接近
      let low = 0;
      let high = param.uniqueIds.length - 1;
      let mid = 0;
      let midOffset = 0;
      while(low <= high) {
        mid = low + Math.floor((high - low) / 2);
        midOffset =getIndexOffset(mid)
        if(midOffset === offsetValue) {
          return mid;
        } else if(midOffset < offsetValue) {
          low = mid + 1;
        } else if(midOffset > offsetValue) {
          high = mid - 1;
        }
      }
      return low > 0 ? low - 1 : 0;
    }
  }
  function handleFront() { // 向上滑动 要不要更新start
    const overs = getScrollOvers();
    if(overs > range.start) { // start不用改变
      return;
    }
    const start = Math.max(overs - param.buffer, 0)
    checkRange(start, getEndByStart(start))
  }
  function handleBehind() {
    const overs = getScrollOvers();
    if(overs < range.start + param.buffer) {
      // 是否在缓存区或者可视区中
      return;
    }
    checkRange(overs, getEndByStart(overs))

  }
  function handleScroll(offset: number){
    const direction = offset < offsetValue? 'FRONT' : 'BEHIND';
    offsetValue = offset;
    if(direction === 'FRONT') {
      handleFront()
    } else {
      handleBehind()
    }
  }
  
  function saveSize(id: string | number, size: number) {
    sizes.set(id, size)
    if(calcType === CALC_TYPE.INIT) {
      fixedSizeVal = size
      calcType = CALC_TYPE.FIXED
    } else if(calcType === CALC_TYPE.FIXED && fixedSizeVal !== size) {
      calcType = CALC_TYPE.DYNAMIC
      fixedSizeVal = 0 // 切换到动态高度
    }
    // 尽可能不要采用 estimateSize 作为唯一标识符，因为可能出现相同的高度，导致无法区分
    // 如果是动态高度,原则上应该用预估值
    if(calcType === CALC_TYPE.DYNAMIC) {
      // 根据已经加载的数据算一个平均值 来撑开滚动条
      if(sizes.size < Math.min(param.keeps, param.uniqueIds.length)) { // 根据当前展示的数据 来计算一个滚动条的值
        firstRangeAvg = Math.round([...sizes.values()].reduce((acc, cur) => acc + cur, 0) / sizes.size)
      }
    }
  }
  checkRange(0, param.keeps - 1)
  return {
    handleScroll,
    saveSize,
  }
}
function installVirtual() {
  // 初始化逻辑
  virtual.value = initVirtual(
  {
    keeps: props.keeps,
    buffer: Math.round(props.keeps / 4),
    uniqueIds: getUniqueIdFromDataSources(),
    estimateSize: props.estimateSize,
  }, update)
}
onBeforeMount(() => {
  installVirtual()
})

// 计算要渲染的数据
const renderedDataSources = computed(() => {
  if (!range.value) return [];
  const { start, end } = range.value;
  const { dataSources } = props;
  return dataSources.slice(start, end + 1).filter((dataSource) => dataSource);
});


function handleScroll() {
  if(!virtualRef.value) return;
  const offset = virtualRef.value.scrollTop;
  virtual.value.handleScroll(offset)
}

function handleItemResize(id: string | number, size: number) {
  virtual.value.saveSize(id, size)
}

</script>

<style scoped>
.item-list {
  height: 100%;
}
</style>