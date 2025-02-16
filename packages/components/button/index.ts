// 整合组件 最终实现导出组件
import { withInstall } from '@chengbai/utils/with-install';
import _Button from './src/button.vue';

const Button = withInstall(_Button);

export default Button; // 可以通知app.use来使用 也可以通过 import方式单独使用

export * from './src/button'

declare module 'vue'{
  export interface GlobalComponents { // 接口可以自动合并
    CButton: typeof Button
  }
}