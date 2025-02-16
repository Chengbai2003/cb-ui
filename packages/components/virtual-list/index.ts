import { withInstall } from '@chengbai/utils/with-install';
import _VirtualList from './src/virtual.tsx';

const Tree = withInstall(_VirtualList)

export default Tree

declare module 'vue' {
  export interface GlobalComponents {
    CVirtualList: typeof _VirtualList
  }
}

export * from './src/virtual.tsx';