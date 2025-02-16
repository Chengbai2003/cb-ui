## Icon图标

c-ui 推荐使用 xicons 作为图标库

```
$ pnpm install @vicons/ionicons5
```

## 使用图标

- 如果你想像用例一样一直使用,需要注册全局组件，才能够直接在项目中使用


<script setup lang="ts">
import { AlertCircleOutline } from '@vicons/ionicons5'
</script>
<c-icon color="red" size="40">
  <AlertCircleOutline />
</c-icon>

<c-icon color="green" size="40">
  <AlertCircleOutline />
</c-icon>

<c-icon color="bule" size="40">
  <AlertCircleOutline />
</c-icon>

<c-icon color="red" size="60">
  <AlertCircleOutline />
</c-icon>

<c-icon color="green" size="60">
  <AlertCircleOutline />
</c-icon>

<c-icon color="bule" size="60">
  <AlertCircleOutline />
</c-icon>


```vue
<script setup lang="ts">
import { AlertCircleOutline } from "@vicons/ionicons5"
</script>
<template>
  <c-icon color="red" size="40">
    <AlertCircleOutline />
  </c-icon>
</template>
```

## API

### Icon Props

| 名称   | 类型               | 默认值    |  说明    |
| ------ | ------------------ | -------   | -------- |
| color  | string             | undefined | 图标颜色 |
| size   | number \| string   | undefined | 图标大小 |