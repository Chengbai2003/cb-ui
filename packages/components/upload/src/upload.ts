import { ExtractPropTypes, PropType } from "vue"


// 给文件包装成全新的类型

export interface UploadFile {
  uid?: number,
  name: string,
  url?: string,
  percentage?: number
  raw?: File,
  size?: number,
  status: string
}

export type UploadFiles = UploadFile[]


// 组件的类型
export const baseProps = {
  FileList: {
    type: Array as PropType<UploadFiles>,
    default: () => [] as const
  },
  action: {
    type: String,
    default: ''
  },
  multiple: {
    type: Boolean,
    default: false
  },
  // input所需要的类型
  name: {
    type: String,
    default: 'file'
  },
  accept: {
    type: String,
    default: ''
  },
  method: {
    type: String,
    default: 'post'
  },
  headers: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: () => ({})
  },
  drag: {
    type: Boolean,
    default: false
  },
} as const

export type UploadRawFile = File & {uid: number}
export type UploadProgressEvent = ProgressEvent & {percentage: number}
const NOOP = () => {}

export const uploadProps = {
  ...baseProps,
  onPreview: {
    type: Function as PropType<(file: UploadFile) => void>,
    default: NOOP
  },
  beforeUpload: {
    type: Function as PropType<(file: UploadRawFile) => Promise<boolean> | boolean>,
    default: NOOP
  },
  onChange: {
    type: Function as PropType<(file: UploadFile) => void>,
    default: NOOP
  },
  beforeRemove: {
    type: Function as PropType<(file: UploadFile, uploadFiles: UploadFiles) => Promise<boolean> | boolean>,
    default: NOOP
  },
  onRemove: {
    type: Function as PropType<(file: UploadFile, uploadFiles: UploadFiles) => void>,
    default: NOOP
  },
  onPorgress: {
    type: Function as PropType<(e: UploadProgressEvent,uploadFile: UploadFile, uploadFiles: UploadFiles) => void>,
    default: NOOP
  },
  onSuccess: {
    type: Function as PropType<(response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => void>,
    default: NOOP
  },
  onError: {
    type: Function as PropType<(error: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => void>,
    default: NOOP
  }
} as const

export type UploadProps = ExtractPropTypes<typeof uploadProps>

let id = 0;
export const genId = () => id++;