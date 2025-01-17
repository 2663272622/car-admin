<template>
    <el-dialog
      v-model="modelValue"
      :title="props.title"
      width="600px"
      @closed="handleCloseDialog"
      >
      <!-- :destroy-on-close="true" -->
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" v-if="formKey">
        <el-form-item label="ID" prop="id" v-if="props.type == 'info'">
          <el-input v-model="formData.id" />
        </el-form-item>
        <el-form-item label="车牌号" prop="carNumber">
          <el-input v-model="formData.carNumber" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input v-model="formData.phoneNumber" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="消息内容" prop="messageText">
          <el-input v-model="formData.messageText" type="textarea" placeholder="请输入消息内容" />
        </el-form-item>
        <el-form-item label="联系备注" prop="contactRemark">
          <el-input v-model="formData.contactRemark" type="textarea" placeholder="请输入联系您时的备注" />
        </el-form-item>
        <el-form-item label="使用次数" prop="usageCount" v-if="props.type == 'info'">
        <el-input-number class="!w-full" v-model="formData.usageCount" :precision="0" :step="1" :min="0" />
      </el-form-item>
        <el-form-item label="激活状态" prop="active" v-if="props.type != 'add'">
          <el-radio-group v-model="formData.active">
            <el-radio :value="true" label="已激活" >已激活</el-radio>
            <el-radio :value="false" label="未激活" >未激活</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否禁用" prop="banFlag" v-if="props.type != 'add'">
          <el-radio-group v-model="formData.banFlag">
            <el-radio :value="true" label="已禁用" >已禁用</el-radio>
            <el-radio :value="false" label="已激活" >已激活</el-radio>
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
import carMoveCodesAPI from "@/api/system/client/carMoveCodes";
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
  // phoneNumber: { pattern: /^1[3456789]\d{9}$/, message: "手机号格式不正确", trigger: "blur" },
});

const formKey = ref(-1)

const getInfo = async() =>{
  if(!props.id) return;
  const res = await carMoveCodesAPI.getFormData(props.id) 
  
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
        carMoveCodesAPI.add(formData.value).then((res) => {
            ElMessage.success("操作成功");
            handleCloseDialog()
          })
          .finally(() => ( loading.close()));
      } else {
        carMoveCodesAPI.update(props.id, formData.value)
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
