// 整合组件 最终实现导出组件
import { withInstall } from '@chengbai/utils/with-install';
import _Checkbox from './src/checkbox.vue';

const Checkbox = withInstall(_Checkbox);

export default Checkbox; // 可以通知app.use来使用 也可以通过 import方式单独使用

export * from './src/checkbox'

declare module 'vue'{
    export interface GlobalComponents { // 接口可以自动合并
      CCheckbox: typeof Checkbox
    }
}