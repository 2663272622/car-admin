<template>
    <el-dialog
      v-model="modelValue"
      :title="props.title"
      width="600px"
      @closed="handleCloseDialog"
      >
      <!-- :destroy-on-close="true" -->
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" v-if="formKey">
        <el-form-item label="选择学校" prop="tenantId"> 
          <schoolSelect  v-model="formData.tenantId" class="!w-[100%]" :disabled="isFieldDisabled()"></schoolSelect>
        </el-form-item> 
        <el-form-item label="骑手姓名" prop="studentName"> 
          <el-input v-model="formData.studentName" placeholder="请输入姓名" :disabled="isFieldDisabled()"/>
        </el-form-item> 
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="formData.phoneNumber" placeholder="请输入手机号" :disabled="isFieldDisabled()"/>
        </el-form-item>
        <el-form-item label="身份证正面" prop="idCardFrontImage">
          <schoolUpload parantPath="theme" v-model="formData.idCardFrontImage" :disabled="isFieldDisabled()"></schoolUpload>
        </el-form-item>
        <el-form-item label="身份证反面" prop="idCardBackImage">
          <schoolUpload parantPath="theme" v-model="formData.idCardBackImage" :disabled="isFieldDisabled()"></schoolUpload>
        </el-form-item>
        <el-form-item label="学生证" prop="studentCardImage">
          <schoolUpload parantPath="theme" v-model="formData.studentCardImage" :disabled="isFieldDisabled()"></schoolUpload>
        </el-form-item>
        <el-form-item label="审核状态" prop="status">
          <el-radio-group v-model="formData.status" :disabled="isAddDisabled()">
            <el-radio label="审核通过" :value=1>审核通过</el-radio>
            <el-radio label="未审核" :value=2>审核未通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="未过原因" prop="reply" v-if="formData.status === 2">
          <el-input v-model="formData.reply" :disabled="isAddDisabled()"/>
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
import riderAuditAPI from "@/api/system/school/riderAudit";
import { ElLoading } from "element-plus";
import type { FormRules } from 'element-plus'

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

const rules = reactive<FormRules>({
  tenantId: [{ required: true, message: "学校不能为空", trigger: "change" }],
  studentName: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  phoneNumber: [{ pattern: /^1[3456789]\d{9}$/, message: "手机号格式不正确", trigger: "blur" }],
  idCardFrontImage: [{ required: true, message: "身份证正面不能为空", trigger: "blur" }],
  idCardBackImage: [{ required: true, message: "身份证反面不能为空", trigger: "blur" }],
  studentCardImage: [{ required: true, message: "学生证不能为空", trigger: "blur" }],
  status: [{ required: true, message: "审核状态不能为空", trigger: "change" }],
  reply: [{ required: true, message: "未过原因不能为空", trigger: "blur" }]
});

//编辑和查看状态下禁用一些属性
const isFieldDisabled = () => {
  return props.type === 'edit' || props.type === 'info';
};
//新增状态和查看状态下禁用属性
const isAddDisabled = () => {
  return props.type === 'add' || props.type === 'info';
};

const formKey = ref(-1)

const getInfo = async() =>{
  if(!props.id) return;
  const res = await riderAuditAPI.getFormData(props.id) 
  
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
        riderAuditAPI.add(formData.value).then((res) => {
            ElMessage.success("操作成功");
            handleCloseDialog()
          })
          .finally(() => ( loading.close()));
      } else {
        riderAuditAPI.update(props.id, formData.value)
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
    createBy:'',
    rewardAmount:'',
    rewardType:'',
    contentDescription:'',
    specifications:'',
  }
}

</script>

<style lang="scss" scoped></style>
