import { ExtractPropTypes, PropType } from "vue";
// eslint-disable-next-line vue/prefer-import-from-vue
import { isString } from '@vue/shared';

export const inputProps = {
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [Number, String] as PropType<string | number>,
    default: ''
  },
  placeholder: {
    type: String,
  },
  clearable: {
    type: Boolean
  },
  showPassword: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly:{
    type: Boolean,
    default: false
  },
  label:{
    type: String
  },
} as const

export type InputProps = ExtractPropTypes<typeof inputProps>

export const inputEmits = {
  'update:modelValue':(val:string) => isString(val),
  input: (val:string) => isString(val),
  change: (val:string) => isString(val),
  focus: (e: FocusEvent) => e instanceof FocusEvent,
  blur: (e: FocusEvent) => e instanceof FocusEvent,
  clear: () => true // 清空事件
}

export type InputEmits = typeof inputEmits;