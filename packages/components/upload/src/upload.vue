<template>
  <UploadContent v-bind="uploadConetntProps">
    <slot></slot>
    {{ uploadFiles }}
  </UploadContent>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { UploadFile, UploadFiles, uploadProps, UploadRawFile } from './upload';
import UploadContent from './upload-content.vue'
import { UploadContentProps } from './upload-content';
defineOptions({
  name: 'c-upload',
})
// 父组件接受了传递给子组件
const props = defineProps(uploadProps)
const emit = defineEmits({})

const uploadFiles = ref<UploadFiles>(props.FileList)
watch(uploadFiles,(newVal) => {
  emit('onUpdate:file-list', newVal)
})

const findFile = (rawFile: UploadRawFile) => {
  return uploadFiles.value.find(file => file.uid === rawFile.uid)
}
const uploadConetntProps = computed<UploadContentProps>(() => {
  return {
    ...props,
    onStart: (rawFile) => {
      // 上传之前的逻辑
      // console.log('onStart')
      const uploadFile: UploadFile = {
        uid: rawFile.uid,
        name: rawFile.name,
        percentage: 0,
        raw: rawFile,
        size: rawFile.size,
        status: 'start'
      }
      uploadFile.url = URL.createObjectURL(rawFile);
      uploadFiles.value = [...uploadFiles.value, uploadFile]
      props.onChange(uploadFile)
    },
    onProgress: (e, rawFile) => {
      // console.log('onProgress')
      const uploadFile = findFile(rawFile)!;
      uploadFile.status = 'uploading'
      uploadFile.percentage = e.percentage
      props.onPorgress(e, uploadFile, uploadFiles.value)
    },
    onRemove: async (rawFile) => {
      const uploadFile = findFile(rawFile)!;
      const res = await props.beforeRemove(uploadFile, uploadFiles.value);
      if (res !== false) {
        const fileList = uploadFiles.value
        fileList.splice(fileList.indexOf(uploadFile), 1)
        props.onRemove(uploadFile, fileList)
      }

    },
    onError: (err) => {
      const uploadFile = findFile(err.rawFile)!;
      const fileList = uploadFiles.value
      uploadFile.status = 'error'
      fileList.splice(fileList.indexOf(uploadFile), 1)
      props.onError(err, uploadFile, fileList)
    },
    onSuccess: (res, rawFile) => {
      const uploadFile = findFile(rawFile)!;
      uploadFile.status = 'success'
      props.onSuccess(res, uploadFile, uploadFiles.value)
    },
  }
})
</script>

<style scoped>

</style>