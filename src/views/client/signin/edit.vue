<template>
    <el-dialog
      v-model="modelValue"
      :title="props.title"
      width="600px"
      @closed="handleCloseDialog"
      >
      <!-- :destroy-on-close="true" -->
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" v-if="formKey">
        <el-form-item label="用户名" prop="createBy"> 
          <el-input v-model="formData.createBy" placeholder="请输入用户名" />
        </el-form-item> 
        <!-- <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" />
        </el-form-item> -->
        <!-- <el-form-item label="身份类型" prop="identityType">
          <el-select v-model="formData.identityType" placeholder="请选择身份类型">
            <el-option :value="1" label="学生" />
            <el-option :value="2" label="配送员" />
          </el-select>
        </el-form-item> -->
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
        <!-- <el-form-item label="学校状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="true">正常</el-radio>
            <el-radio :value="false">禁用</el-radio>
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
import signInAPI from "@/api/system/client/signin";
import { ElLoading } from "element-plus";
import type { FormRules } from 'element-plus'
import { c } from "vite/dist/node/types.d-aGj9QkWt";

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
  createBy: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  // invitedCode: [{ required: true, message: "邀请码不能为空", trigger: "blur" }],
});

const formKey = ref(-1)

const getInfo = async() =>{
  if(!props.id) return;
  const res = await signInAPI.getFormData(props.id) 
  
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
        signInAPI.add(formData.value).then((res) => {
            ElMessage.success("操作成功");
            handleCloseDialog()
          })
          .finally(() => ( loading.close()));
      } else {
        signInAPI.update(props.id, formData.value)
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
    createBy:"",
  }
}

</script>

<style lang="scss" scoped></style>
