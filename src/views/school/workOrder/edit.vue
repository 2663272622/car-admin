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
        <el-form-item label="学生姓名" prop="studentName"> 
          <el-input v-model="formData.studentName" placeholder="请输入姓名" :disabled="isFieldDisabled()"/>
        </el-form-item> 
        <el-form-item label="问题" prop="context">
          <el-input v-model="formData.context" placeholder="请输入问题" type="textarea" :disabled="isFieldDisabled()"/>
        </el-form-item>
        <el-form-item label="问题类型" prop="workOrderType" >
          <dict-select v-model="formData.workOrderType" code="workOrderType" class="!w-[100%]" placeholder="请选择问题类型" :disabled="isFieldDisabled()"></dict-select>
        </el-form-item>
        <el-form-item label="问题回复" prop="ext1" v-if="props.type === 'edit' || props.type === 'info'">
          <el-input v-model="formData.ext1" :disabled="isAddDisabled()"/>
        </el-form-item>
        <!-- <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="formData.phoneNumber"  placeholder="请输入手机号" />
        </el-form-item> -->
        <!-- <el-form-item label="邀请码" prop="invitedCode">
          <el-input v-model="formData.invitedCode"  placeholder="请输入邀请码" />
        </el-form-item>  -->
        <!-- <el-form-item label="显示排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            controls-position="right"
            style="width: 100px"
            :min="0"
          />
        </el-form-item> -->
        <!-- <el-form-item label="学校状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item> -->
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
import issueAPI from "@/api/system/client/issue";
import { ElLoading } from "element-plus";
import type { FormRules } from 'element-plus'
import dictSelect from '@/components/Dict/index.vue'
import { fa, tr } from "element-plus/es/locale";


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
  // tenantId: [{ required: true, message: "学校不能为空", trigger: "change" }],
  // studentName: [{ required: true, message: "学生姓名不能为空", trigger: "blur" }],
  context: [{ required: true, message: "问题不能为空", trigger: "blur" }],
  type: [{ required: true, message: "问题类型不能为空", trigger: "blur" }],
  // phoneNumber: [{ pattern: /^1[3456789]\d{9}$/, message: "手机号格式不正确", trigger: "blur" }],
  // invitedCode: [{ required: true, message: "邀请码不能为空", trigger: "blur" }],
  status: [{ required: true, message: "状态不能为空", trigger: "change" }],
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
  const res = await issueAPI.getFormData(props.id) 
  
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
        issueAPI.add(formData.value).then((res) => {
            ElMessage.success("操作成功");
            handleCloseDialog()
          })
          .finally(() => ( loading.close()));
      } else {
        issueAPI.update(props.id, formData.value)
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
    tenantId:'',
    studentName:'',
    context:'',
    type:'',
    status:1,
  }
}

</script>

<style lang="scss" scoped></style>
