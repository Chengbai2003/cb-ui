import { createNamespace } from "@chengbai/utils/create";
import { computed, defineComponent, onMounted, reactive, ref, watch } from "vue";

export default defineComponent({
  name:'CVirtualList',
  props: {
    size: {
      type: Number,
      default: 35
    },
    remain: {
      type: Number,
      default:8,
    },
    items: {
      type: Array,
      default: () => []
    },
    // 缓存区域长度
    buffer: {
      type: Number,
      default: 4
    }
  },
  setup(props, {slots}) {
    const bem = createNamespace('vl');
    const wrapperRef = ref<HTMLElement>();
    const scrollBarRef= ref<HTMLElement>();
    const state = reactive({
      start: 0,
      end: props.remain
    })
    const prev = computed(() => {
      return Math.min(state.start, props.buffer)
    })
    const next = computed(() => {
      return Math.min(props.buffer, props.items.length - state.end)
    })
    // 应该展示上4条了，下4条,保证快速滚动的时候不会白屏
    const visibleData = computed(() => {
      return props.items.slice(state.start - prev.value, state.end + next.value);
    })
    const offset = ref(0)
    function initWrapper() {
      wrapperRef.value!.style.height = props.remain * props.size + 'px';
      scrollBarRef.value!.style.height = props.items.length * props.size + 'px';
    }
    watch(() => props.items,initWrapper)
    onMounted(() => {
      initWrapper()
    })
    const handleScroll = () => {
      const scrollTop = wrapperRef.value!.scrollTop;
      state.start = Math.floor(scrollTop/props.size)
      state.end = state.start + props.remain;
      offset.value = state.start * props.size - props.size * prev.value; // 滚过去了多少个
    }
    return () => {
      return <div class={bem.b()} ref={wrapperRef} onScroll={handleScroll}>
        <div class={bem.e('scroll-bar')} ref={scrollBarRef}></div>
        <div
          class={bem.e('scroll-list')}
          style={ {transform: `translate3d(0,${offset.value}px,0)`} }
        >
          { visibleData.value.map((node,idx) => slots.default!({node})) }
        </div>
      </div>
    }
  }
})