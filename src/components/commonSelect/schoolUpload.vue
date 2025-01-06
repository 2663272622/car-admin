<template>
  <el-upload
    v-model:file-list="fileList"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    accept="image/*"
    :auto-upload="true"
    :limit="Number(props.max)"
    :before-upload="beforeUpload"
    :class="[fileList.length >= Number(props.max) ? 'upload-overflow' : '']"
    :disabled="disabled"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps, UploadUserFile } from 'element-plus' 
import { client } from '@/utils/upload'
import { useVModel } from '@vueuse/core' 
import { IMG_BASE_URL } from '@/utils/const'

type Files = 'theme' | 'wall';

const props = defineProps({
  parantPath: {// 上传的父级目录
    type: String as () => Files,
    default: '',
    required: true,
  },
  modelValue: {// url,url,url
    type: String || [], 
  },
  max: { // 最大上传数量
    type:Number || String,
    default:1
  },
  disabled: { // 禁用上传
    type: Boolean,
    default: false,
  },
  special:{
    type:Boolean,
    default:false
  },
}); 


const clientclient = client()
console.log(clientclient)
const emit = defineEmits(["update:modelValue","change"]);  
const modelValue = useVModel(props, 'modelValue')  


const dialogImageUrl = ref('')
const dialogVisible = ref(false)

// 删除
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  modelValue.value =   modelValue.value.split(',').filter(i=>uploadFile.url.indexOf(i) == -1).join(',')
}
// 预览
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
// 上传
const beforeUpload = (rawFile) => {
  let name = rawFile.name
  name = new Date().getTime()+'_'+rawFile.name
  let relativePath = props.parantPath+'/'+name
  if(props.special){
    relativePath =rawFile.name
  }



  clientclient.put(relativePath,rawFile)
   .then((res) => {
     modelValue.value = `${modelValue.value ? modelValue.value+',' : ''}${relativePath}`
     console.log("上传成功", res.url,relativePath); 
   })
   .catch((error)=>{
     console.log('发生错误', error);
   }); 
}

const fileList = computed(()=>{
  const arr = (modelValue.value || '').split(",").filter(i=>i).map(i=>({
    name: String(Math.random()),
    url: IMG_BASE_URL + i,
  }))
  return arr.length > 0 ? arr : []
})


</script>


<style lang="scss">
  .upload-overflow{
    .el-upload--picture-card{
      display:none;
    }
  }
</style>
