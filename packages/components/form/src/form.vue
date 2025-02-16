<template>
  <form :class="[bem.b()]">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { createNamespace } from '@chengbai/utils/create'
import { FormContext, FormContextKey, formProps } from './form';
import { provide, reactive } from 'vue';
import { FormItemContext } from './form-item';
import { Values } from 'async-validator';

const bem = createNamespace('form');
defineOptions({
  name:'c-form'
})
const props = defineProps(formProps);
// 定义表单上下文
const formContext = {
  ...props,
  addField: (context: FormItemContext) => addField(context)
}
provide(FormContextKey, formContext)

// form的表单校验
const fields: FormItemContext[] = reactive([]);
const validate = async(
  callback?:(valid: boolean,fields?: Values

  ) => void) => {
    let errors: Values = {}
    for(const field of fields) {
      try {
        await field.validate('')
      } catch(error) {
        errors = {
          ...errors,
          ...(error as Values).fields
        }
      }
    }
    // 无错误便成功
    if(Object.keys(errors).length === 0) {
      return callback?.(true)
    } else {
      // 有错误便失败
      if(callback) {
        callback(false, errors)
      }
      return Promise.reject(errors)
    }
}

const addField: FormContext['addField'] = context => {
  fields.push(context);
}
// 表单校验方法暴露给用户,通过ref来校验整个表单
defineExpose({
  validate
})
</script>

<style scoped>

</style>