//
import DefaultTheme from 'vitepress/theme';

import CIcon from '@chengbai/components/icon'
import '@chengbai/theme-chalk/src/index.scss';

console.log(CIcon)
export default {
  ...DefaultTheme,
  enhanceApp({app}) {
    app.use(CIcon); //在vitepress中 注册全局组件
  }
}