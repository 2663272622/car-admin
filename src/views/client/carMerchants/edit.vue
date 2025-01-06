<template>
    <el-dialog
      v-model="modelValue"
      :title="props.title"
      width="800px"
      @closed="handleCloseDialog"
      >
      <!-- :destroy-on-close="true" -->
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" v-if="formKey">
        <el-form-item label="图片" prop="storeLogoUrl">
          <schoolUpload parantPath="theme" v-model="formData.storeLogoUrl" max="9"></schoolUpload>
        </el-form-item>
        <el-form-item label="商店名称" prop="merchantName"> 
          <el-input v-model="formData.merchantName" placeholder="请输入商店名称" />
        </el-form-item> 
        <el-form-item label="经营业务" prop="businessScope" >
          <dict-select v-model="formData.businessScope" type="checkbox" code="businessScope" class="!w-[100%]" placeholder="请选择经营业务"></dict-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone"> 
          <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" />
        </el-form-item> 
        <el-form-item label="开门时间" prop="openTime"> 
          <el-time-select
            v-model="formData.openTime"
            :max-time="formData.closeTime"
            placeholder="开门时间"
            start="00:00"
            step="00:15"
            end="24:00"
          />
        </el-form-item> 
        <el-form-item label="关门时间" prop="closeTime"> 
          <el-time-select
            v-model="formData.closeTime"
            :min-time="formData.openTime"
            placeholder="关门时间"
            start="00:00"
            step="00:15"
            end="24:00"
          />
        </el-form-item> 
        <el-form-item label="用户ID" prop="userId"> 
          <el-input-number v-model="formData.userId"  class="!w-full" placeholder="请输入用户ID" />
        </el-form-item> 
        <el-form-item label="地址" prop="storeAddress"> 
          <el-input v-model="formData.storeAddress" placeholder="请输入地址" />
        </el-form-item> 
        <el-form-item label="商店介绍" prop="storeDescription"> 
          <el-input v-model="formData.storeDescription" placeholder="请输入商店介绍" />
        </el-form-item> 
        <el-form-item label="纬度" prop="longitude"> 
          <el-input v-model="formData.longitude" placeholder="请输入纬度" />
        </el-form-item> 
        <el-form-item label="经度" prop="latitude"> 
          <el-input v-model="formData.latitude" placeholder="请输入经度" />
        </el-form-item> 
        <el-form-item label="购买总数" prop="bought" v-if="props.type === 'info'">
          <el-input-number class="!w-full" v-model="formData.bought" :precision="0" :step="1" :min="0" />
        </el-form-item>
        <el-form-item label="购买历史" prop="boughtHistory" v-if="props.type === 'info'">
          <el-input class="!w-full" v-model="formData.boughtHistory" :precision="0" :step="1" :min="0" />
        </el-form-item>
        <el-form-item label="热度" prop="heat">
        <el-input-number class="!w-full" v-model="formData.heat" :precision="0" :step="1" :min="0" />
      </el-form-item>
      <el-form-item label="激活状态" prop="active" v-if="props.type == 'info'||props.type == 'edit'">
          <el-radio-group v-model="formData.active">
            <el-radio :value="true" label="已激活" >已激活</el-radio>
            <el-radio :value="false" label="未激活" >未激活</el-radio>
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
import dictSelect from '@/components/Dict/index.vue'
import signInAPI from "@/api/system/client/carMerchants";
import { ElLoading } from "element-plus";
import type { FormRules } from 'element-plus'
import schoolUpload from "@/components/commonSelect/schoolUpload.vue";
import { fa, tr } from 'element-plus/es/locale';
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
  // storeLogoUrl: [{ required: true, message: "图片不能为空", trigger: "blur" }],
  merchantName: [{ required: true, message: "商店名称不能为空", trigger: "blur" }],
  // businessScope: [{ required: true, message: "营业类型不能为空", trigger: "blur" }],
  userId: [{ required: true, message: "用户ID不能为空", trigger: "blur" }],
  storeAddress: [{ required: true, message: "地址不能为空", trigger: "blur" }],
  openTime: [{ required: true, message: "开门时间不能为空", trigger: "change" }],
  closeTime: [{ required: true, message: "关门时间不能为空", trigger: "change" }],
  contactPhone: [{ pattern: /^1[3456789]\d{9}$/, message: "手机号格式不正确", trigger: "blur" },
                { required: true, message: "联系电话不能为空", trigger: "blur" }],
});

const formKey = ref(-1)

const getInfo = async() =>{
  if(!props.id) return;
  const res = await signInAPI.getFormData(props.id) 
  res.openTime = formatTimeFromArray(res.openTime)
  res.closeTime = formatTimeFromArray(res.closeTime)
  res.businessScope = res.businessScope.split(",")
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
      formData.value.businessScope = formData.value?.businessScope?.join(",")
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
    businessScope:[],
    contactPhone:"",
    storeAddress:"",
    storeDescription:"",
    storeLogoUrl:"",
    openTime:"",
    closeTime:"",
    bought:0,
    boughtHistory:0,
    heat:0,
    merchantName:"",
    userId:0,
    id:0,
    type:1,
    sort:0,
    remark:"",
    active:false,
  }
}

function formatTimeFromArray(timeArray) {
  if (!timeArray) {
    return ""; 
  }
  else{
    while (timeArray.length < 2) {
    timeArray.push(0);
  }
  let [hours, minutes] = timeArray.map(num => String(num).padStart(2, '0'));
  return `${hours}:${minutes}`;
  }
}
</script>

<style lang="scss" scoped></style>
