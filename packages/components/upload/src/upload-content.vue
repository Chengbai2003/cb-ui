<template>
  <div @click="handleClick" :class="[bem.b()]">
    <template v-if="drag">
      <UploadDragger @file="uploadFile">
        <slot></slot>
      </UploadDragger>
    </template>
    <template v-else>
      <slot></slot>
    </template>
    <input
      type="file"
      ref="inputRef"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { genId, UploadRawFile } from './upload';
import { createNamespace } from '@chengbai/utils/create';
import { uploadContentProps } from './upload-content';
import { httpRequest } from './ajax';
import UploadDragger from './upload-dragger.vue';

const bem = createNamespace('upload');
defineOptions({
  name:'c-upload',
  inheritAttrs: false,
})

const props = defineProps(uploadContentProps)

async function upload(rawFile: UploadRawFile) {
  inputRef.value!.value = ''; // 上传之前清空
  let res = await props.beforeUpload(rawFile)
  if(res === false) return props.onRemove(rawFile)

  // 上传过程
  const { method, name, action, headers, data} = props
  httpRequest({
    method,
    file: rawFile,
    name,
    action,
    headers,
    data,
    onError:(e) => {
      props.onError(e, rawFile);
    },
    onSuccess: (res) => {
      props.onSuccess(res, rawFile);
    },
    onProgress: (e) => {
      props.onProgress(e, rawFile);
    }

  })

}

function uploadFile(files: FileList) {
  for(let i = 0; i < files.length; i++) {
    const rawFile = files[i] as UploadRawFile;
    rawFile.uid = genId()
    props.onStart(rawFile)
    upload(rawFile)
  }
}
const handleChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files!;
  uploadFile(files)
}
const handleClick = () => {
  inputRef.value!.value = ''
  inputRef.value!.click()
}

const inputRef = ref<HTMLInputElement>();
</script>

<style scoped>

</style>