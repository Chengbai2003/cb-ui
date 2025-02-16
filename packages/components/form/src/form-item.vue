<template>
  <div :class="[
      bem.b(),
      bem.is('success', validateState === 'success'),
      bem.is('error', validateState === 'error')
    ]">
    <label :class="bem.e('label')" :style="{ width: labelWidth,}">
      <slot name="lable">
        {{ label }}
      </slot>
    </label>
    <div :class="bem.e('content')">
      <slot></slot>
      <div :class="bem.e('error')">
        <slot name="error">
          {{ validateMessage }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@chengbai/utils/create'
import { computed, inject, onMounted, provide, ref, toRefs } from 'vue';
import { Arrayable, FormItemContext, formItemContextKey, formItemProps, FormItemRule, FormItemValidateState } from './form-item';
import { FormContextKey } from './form';
import AsyncValidator, { Value, Values } from 'async-validator'

const formContext = inject(FormContextKey)

const labelWidth = computed(() => {
  const width = formContext?.labelWidth
  return typeof width === 'string' ? width : `${width}px`
})
const bem = createNamespace('form-item');
defineOptions({
  name: 'c-form-item'
});
// 主要是校验逻辑
const validateState = ref<FormItemValidateState>('');
const validateMessage = ref('');

const converArray = (rules: Arrayable<FormItemRule> | undefined) => {
  return rules ? (Array.isArray(rules)
      ? rules
      : [rules])
    : []
}
const _rules = computed(() => {
  const myRules: FormItemRule[] = converArray(props.rules)
  const formRules = formContext?.rules;
  if(formRules && props.prop) {
    const _temp = formRules[props.prop];
    if(_temp) {
      myRules.push(...converArray(_temp))
    }
  }
  return myRules
})
const props = defineProps(formItemProps);



const getRuleFiltered = (trigger: string) => {
  const rules = _rules.value
  return rules.filter(rule => {
    if(!rule.trigger || !trigger) return true
    if(Array.isArray(rule.trigger)) {
      return rule.trigger.includes(trigger)
    } else {
      return rule.trigger === trigger
    }
  })
}
const onValidationSuccessed = () => {
  validateState.value = 'success'
  validateMessage.value = ''
}
const onValidationFailed = (error: Values) => {
  validateState.value = 'error'

  // console.log(error)
  const { errors } = error
  validateMessage.value = errors ? errors[0].message : '';
}

const validate: FormItemContext['validate'] = async (trigger: string, callback?) => {
  // 拿到触发时机
  const rules = getRuleFiltered(trigger)

  const modelName = props.prop!;
  // 拿到校验器
  const validator = new AsyncValidator({
    [modelName]: rules
  })
  const model = formContext!.model!
  return validator.validate({
    [modelName]: model[modelName]
  }).then(() => {
    onValidationSuccessed()
  }).catch((err: Values) => {
    onValidationFailed(err)
    return Promise.reject(err)
  })
}

const context: FormItemContext = {
  ...toRefs(props),
  validate,
}
provide(formItemContextKey, context)

onMounted(() => {
  formContext?.addField(context)
})
</script>

<style scoped>

</style>