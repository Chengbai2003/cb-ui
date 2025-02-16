import { withInstall } from '@chengbai/utils/with-install'

import _FormItem from './src/form-item.vue'
import _Form from './src/form.vue'

const FormItem = withInstall(_FormItem)
const Form = withInstall(_Form)

export { FormItem, Form };

export type { FormItemProps } from './src/form-item'
export type { FormProps, FormInstance } from './src/form'

declare module 'vue' {
  export interface GlobalComponents {
    CFormItem: typeof FormItem,
    CForm: typeof Form
  }
}