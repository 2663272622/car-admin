<template>
    <el-dialog
      v-model="modelValue"
      :title="props.title"
      width="600px"
      @closed="handleCloseDialog"
      >
      <!-- :destroy-on-close="true" -->
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" v-if="formKey">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="formData.content" type="textarea" placeholder="请输入消息内容" />
        </el-form-item>
        <el-form-item label="通知目标类型" prop="targetType">
          <el-radio-group v-model="formData.targetType">
            <el-radio :value=1 label="全体用户">全体用户</el-radio>
            <el-radio :value=2 label="指定用户">指定用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用次数" prop="usageCount" v-if="props.type == 'info'">
        <el-input-number class="!w-full" v-model="formData.usageCount" :precision="0" :step="1" :min="0" />
      </el-form-item>
        <el-form-item label="优先级" prop="level">
          <el-radio-group v-model="formData.level">
            <el-radio :value='L' label="低优先级">低优先级</el-radio>
            <el-radio :value='M' label="中优先级">中优先级</el-radio>
            <el-radio :value='H' label="高优先级">高优先级</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form> 
      <template #footer >
        <div class="dialog-footer" v-if="props.type !== 'info'">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import schoolUpload from "@/components/commonSelect/schoolUpload.vue";
import noticesAPI from "@/api/system/client/notice";
import { ElLoading } from "element-plus";
const props = defineProps({
  modelValue: {
    type: Boolean, 
  },
  title:{
    type:String
  },
  type:{
    type:String
  },
  id:{
    type:Number
  },
});
const emit = defineEmits(["update:modelValue","reload"]);  
const modelValue = useVModel(props, 'modelValue')

const formRef = ref(ElForm);

const formData = ref();

watch(()=>modelValue.value,(newVal,oldVal)=>{
  if(newVal){     
    initForm()
    switch(props.type){
      case "add":
        resetForm()
      break;
      case "info":
        getInfo()
      break;
      case "edit":
        getInfo()
      break;
    }
  }
},{immediate:true})

const rules = reactive({
  // tenantId: [{ required: true, message: "学校不能为空", trigger: "change" }],
  // title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
  // content: [{ required: true, message: "话题内容不能为空", trigger: "blur" }],
  // imagePath: [{ required: true, message: "图片不能为空", trigger: "blur" }],
});

const formKey = ref(-1)

const getInfo = async() =>{
  if(!props.id) return;
  const res = await noticesAPI.getFormData(props.id) 
  
  formData.value = res
  formKey.value = Math.random()
  console.log(res) 

}

// 提交表单
function handleSubmit() {
  formRef.value.validate((valid: any) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })  
      
      if (props.type == 'add') {
        console.log(formData.value)
        noticesAPI.add(formData.value).then((res) => {
            ElMessage.success("操作成功");
            handleCloseDialog()
          })
          .finally(() => ( loading.close()));
      } else {
        noticesAPI.update(props.id, formData.value)
          .then(() => {
            ElMessage.success("操作成功"); 
            handleCloseDialog()
          })
          .finally(() => ( loading.close()));
      }
    }
  });
} 

// 关闭弹窗
function handleCloseDialog() {
  resetForm();
  modelValue.value = false;
  emit("reload")
}
// 重置表单
function resetForm() { 
  if(formRef.value){
    formRef.value.resetFields && formRef.value.resetFields();
    formRef.value.clearValidate && formRef.value.clearValidate();
  }
  initForm()
}

const initForm = () => {
  formData.value = { 
    title:'',
    content:'',
    tenantId:'',
    imagePath:"",
    ext1:"",
    likes:0,
    comment:0,
    views:0,
    heat:0,
    integral:0,
  }
}

</script>

<style lang="scss" scoped></style>
