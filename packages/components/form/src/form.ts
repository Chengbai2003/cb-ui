import { ExtractPropTypes, InjectionKey, PropType } from 'vue'
import { Arrayable, FormItemContext, FormItemRule } from './form-item'

export type FormValidateCallback = (valid: boolean, fields?: Values) => void

export interface FormInstance {
  validate: (callback?: FormValidateCallback) => Promise<void>
}

export const formProps = {
  model: Object,
  rules: {
    type: Object as PropType<Record<string, Arrayable<FormItemRule>>>
  },
  labelWidth: {
    type: [String, Number],
    default: '100px'
  },
  showMessage: {
    type: Boolean,
    default: true
  }
} as const

export type FormProps = Partial<ExtractPropTypes<typeof formProps>>

export interface FormContext extends FormProps {
  // ...
  addField:(field: FormItemContext) => void
}

export const FormContextKey: InjectionKey<FormContext> = Symbol()