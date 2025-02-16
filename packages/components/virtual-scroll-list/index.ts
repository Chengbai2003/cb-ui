import { withInstall } from '@chengbai/utils/with-install';
import _VirtualList from './src/virtual-list.vue';

const VirtualList = withInstall(_VirtualList);

export default VirtualList; // 可以通知app.use来使用 也可以通过 import方式单独使用

export * from './src/virtual-list'

declare module 'vue'{
  export interface GlobalComponents { // 接口可以自动合并
    CVirtualScrollList: typeof VirtualList
  }
}



export type { VirtualProps } from './src/virtual-list';