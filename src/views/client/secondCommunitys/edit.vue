<template>
    <el-dialog
      v-model="modelValue"
      :title="props.title"
      width="600px"
      @closed="handleCloseDialog"
      >
      <!-- :destroy-on-close="true" -->
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="90px" v-if="formKey">
        <el-form-item label="小区名称" prop="communityName"> 
          <el-input v-model="formData.communityName" placeholder="请输入小区名称" />
        </el-form-item>  
        <el-form-item label="所属区" prop="districtId" >
            <dict-select v-model="formData.districtId" code="municipalDistrict" class="!w-[100%]" placeholder="请输入所属区"></dict-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="formData.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="小区坐标" prop="Longitude" >
            <el-input
              :value="formData.longitude ? (formData.latitude+','+formData.longitude) : ''"   placeholder="请输入地址" 
              disabled
            >
              <template #suffix>
                <el-icon @click="()=>{  showCheckCoord=true;}"><Position /></el-icon> 
              </template>
            </el-input>
        </el-form-item>
        <el-form-item label="小区状态" prop="status" >
          <el-radio-group v-model="formData.status">
            <el-radio value="1" label="正常" >接受</el-radio>
            <el-radio value="2" label="维护中" >不接受</el-radio>
            <el-radio value="3" label="停用" >不接受</el-radio>
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


    <checkCoord 
      v-if="showCheckCoord" 
      v-model="showCheckCoord" 
      :coord="formData.latitude+','+formData.longitude" 
      @change="(val,val2)=>{ 
          let str = val.split(',') 
          formData.longitude = str[0] ;
          formData.latitude = str[1];
          // formData.workLocation = val2; / 
      }"
    ></checkCoord> 

    
    <!-- <checkCoord 
      v-if="showCheckCoord" 
      v-model="showCheckCoord" 
      :coord="formData.latitude+','+formData.longitude" 
      @change="(val,val2)=>{ 
          let str = val.split(',')
          if(selectType == 2){
            formData.Longitude = str[0] ;
            formData.workLocationLatitude = str[1];
            formData.workLocation = val2; 
          } 
      }"
    ></checkCoord>  -->
</template>

<script lang="ts" setup>
import dictSelect from '@/components/Dict/index.vue'
import secondAPI from "@/api/system/client/secondCommunitys";
import { ElLoading } from "element-plus";
import type { FormRules } from 'element-plus'
import { el } from "element-plus/es/locale";

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
const showCheckCoord = ref(false)

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
  userName: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  // password: [
  //   { required: true, message: "密码不能为空", trigger: "blur" },
  //   { min: 6, message: "密码长度不能小于6位", trigger: "blur" }
  // ],
  identityType: [{ required: true, message: "身份类型不能为空", trigger: "blur" }],
  openId: [{ required: true, message: "openid不能为空", trigger: "blur" }],
  phoneNumber: [{ pattern: /^1[3456789]\d{9}$/, message: "手机号格式不正确", trigger: "blur" },
    { required: true, message: "手机号不能为空", trigger: "blur" }
  ],
  // invitedCode: [{ required: true, message: "邀请码不能为空", trigger: "blur" }],
});

const formKey = ref(-1)

const getInfo = async() =>{
  if(!props.id) return;
  const res = await secondAPI.getFormData(props.id) 
  
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
        secondAPI.add(formData.value).then((res) => {
            ElMessage.success("操作成功");
            handleCloseDialog()
          })
          .finally(() => ( loading.close()));
      } else {
        secondAPI.update(props.id, formData.value)
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
    userName:'',
    password:'',
    identityType:'',
    phoneNumber:'',
    invitedCode:'',
  }
}

</script>

<style lang="scss" scoped></style>
