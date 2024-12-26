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
          <schoolSelect  v-model="formData.tenantId" class="!w-[100%]" ></schoolSelect>
        </el-form-item> 
        <el-form-item label="楼宇" prop="address">  
          <el-input v-model="formData.name" placeholder="请选择楼宇" />
        </el-form-item> 
        <el-form-item label="地址" prop="ext1">
          <el-input v-model="formData.ext1" placeholder="请输入经纬度" />
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
import schoolSelect from "@/components/commonSelect/schoolSelect.vue";
import schoolLocationAPI from "@/api/system/school/schoolLocation";
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
  // tenantId: [{ required: true, message: "学校不能为空", trigger: "change" }],
  // studentName: [{ required: true, message: "学生姓名不能为空", trigger: "blur" }],
  contentDescription: [{ required: true, message: "请求内容不能为空", trigger: "blur" }],
  // type: [{ required: true, message: "问题类型不能为空", trigger: "blur" }],
  // phoneNumber: [{ pattern: /^1[3456789]\d{9}$/, message: "手机号格式不正确", trigger: "blur" }],
  // invitedCode: [{ required: true, message: "邀请码不能为空", trigger: "blur" }],
  // status: [{ required: true, message: "状态不能为空", trigger: "change" }],
});

const formKey = ref(-1)

const getInfo = async() =>{
  if(!props.id) return;
  const res = await schoolLocationAPI.getFormData(props.id) 
  
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
        schoolLocationAPI.add(formData.value).then((res) => {
            ElMessage.success("操作成功");
            handleCloseDialog()
          })
          .finally(() => ( loading.close()));
      } else {
        schoolLocationAPI.update(props.id, formData.value)
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
