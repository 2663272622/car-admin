<template>
    <el-dialog
      v-model="modelValue"
      :title="props.title"
      width="800px"
      @closed="handleCloseDialog"
      >
      <!-- :destroy-on-close="true" -->
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" v-if="formKey">
        <!-- <el-form-item label="图片" prop="storeLogoUrl">
          <schoolUpload parantPath="theme" v-model="formData.storeLogoUrl" max="9"></schoolUpload>
        </el-form-item> -->
        <el-form-item label="意向小区" prop="intendedCommunity"> 
          <el-input v-model="formData.intendedCommunity" placeholder="请输入意向小区" />
        </el-form-item>  
        <el-form-item label="坐标" prop="intendedCommunityLongitude" >
            <el-input
              :value="formData.intendedCommunityLatitude ? (formData.intendedCommunityLatitude+','+formData.intendedCommunityLongitude) : ''"   placeholder="请输入地址" 
              disabled
            >
              <template #suffix>
                <el-icon @click="()=>{ selectType=1; showCheckCoord=true;}"><Position /></el-icon> 
              </template>
            </el-input>
        </el-form-item>
        <el-form-item label="工作位置" prop="workLocation"> 
          <el-input v-model="formData.workLocation" placeholder="请输入工作位置" />
        </el-form-item>  
        <el-form-item label="坐标" prop="workLocationLongitude" >
            <el-input
              :value="formData.workLocationLatitude ? (formData.workLocationLatitude+','+formData.workLocationLongitude) : ''"   placeholder="请输入地址" 
              disabled
            >
              <template #suffix>
                <el-icon @click="()=>{ selectType=2; showCheckCoord=true;}"><Position /></el-icon> 
              </template>
            </el-input>
        </el-form-item>
        <el-form-item label="热门商圈" prop="popularBusinessDistrict"> 
          <el-input v-model="formData.popularBusinessDistrict" placeholder="请输入热门商圈" />
        </el-form-item>  
        <el-form-item label="坐标" prop="popularBusinessDistrictLatitude" >
            <el-input
              :value="formData.popularBusinessDistrictLongitude ? (formData.popularBusinessDistrictLongitude+','+formData.popularBusinessDistrictLatitude) : ''"   placeholder="请输入地址" 
              disabled
            >
              <template #suffix>
                <el-icon @click="()=>{ selectType=3; showCheckCoord=true;}"><Position /></el-icon> 
              </template>
            </el-input>
        </el-form-item>
      <el-form-item label="接受波动" prop="acceptFluctuation" >
          <el-radio-group v-model="formData.acceptFluctuation">
            <el-radio :value="1" label="接受" >接受</el-radio>
            <el-radio :value="0" label="不接受" >不接受</el-radio>
          </el-radio-group>
        </el-form-item> 
      <el-form-item label="接受拼团" prop="isSharing" >
          <el-radio-group v-model="formData.isSharing">
            <el-radio :value="1" label="接受" >接受</el-radio>
            <el-radio :value="0" label="不接受" >不接受</el-radio>
          </el-radio-group>
        </el-form-item> 
        
        <!-- <el-form-item label="经营业务" prop="businessScope" >
          <dict-select v-model="formData.businessScope" type="checkbox" code="businessScope" class="!w-[100%]" placeholder="请选择经营业务"></dict-select>
        </el-form-item> --> 
        <el-form-item label="入住时间" prop="contactInfo">  
          <el-date-picker
            v-model="formData.moveInDate"
            type="date"
            placeholder="Pick a day" 
            value-format="YYYY-MM-DD 00:00:00" 

          />
        </el-form-item>  
        <el-form-item label="联系方式" prop="contactInfo"> 
          <el-input v-model="formData.contactInfo" placeholder="请输入联系方式" />
        </el-form-item>  
        <el-form-item label="租房预期" prop="expectedPrice"> 
          <el-input v-model="formData.expectedPrice" placeholder="请输入租房预期" type="number"/>
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
          if(selectType == 2){
            formData.workLocationLongitude = str[0] ;
            formData.workLocationLatitude = str[1];
            formData.workLocation = val2; 
          }else if(selectType == 1){
            formData.intendedCommunityLongitude = str[0] ;
            formData.intendedCommunityLatitude = str[1];
            formData.intendedCommunity = val2; 
          }else{
            formData.popularBusinessDistrictLongitude = str[0] ;
            formData.popularBusinessDistrictLatitude = str[1];
            formData.popularBusinessDistrict = val2; 
          }
      }"
    ></checkCoord> 
</template>

<script lang="ts" setup>
import dictSelect from '@/components/Dict/index.vue'
// import rentalRequestsAPI from "@/api/system/client/carMerchants";
import { ElLoading } from "element-plus";
import type { FormRules } from 'element-plus'
import schoolUpload from "@/components/commonSelect/schoolUpload.vue";
import checkCoord from "@/components/checkCoord/index.vue";
import rentalRequestsAPI from "@/api/system/client/rentalRequests";
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

const showCheckCoord = ref(false)
const nowBought=ref(0)
const formRef = ref(ElForm);

const selectType = ref()

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
  // "formData.longitude+','+formData.latitude" 
  // openTime: [{ required: true, message: "开门时间不能为空", trigger: "change" }],
  // closeTime: [{ required: true, message: "关门时间不能为空", trigger: "change" }],
  contactPhone: [{ pattern: /^1[3456789]\d{9}$/, message: "手机号格式不正确", trigger: "blur" },
                { required: true, message: "联系电话不能为空", trigger: "blur" }],
});

const formKey = ref(-1)

const getInfo = async() =>{
  if(!props.id) return;
  nowBought.value=0
  const res = await rentalRequestsAPI.getFormData(props.id) 
  res.openTime = formatTimeFromArray(res.openTime)
  res.closeTime = formatTimeFromArray(res.closeTime)
  res.businessScope = res.businessScope?.split(",")
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
      // formData.value.businessScope = formData.value?.businessScope?.join(",")
      // formData.value.bought=String(nowBought.value+Number(formData.value.bought))
      // if(formData.value.boughtHistory){
      //   formData.value.boughtHistory=formData.value.boughtHistory+','+nowBought.value
      // }else{
      //   formData.value.boughtHistory=nowBought.value
      // }
      if (props.type == 'add') {
        console.log(formData.value)
        rentalRequestsAPI.add(formData.value).then((res) => {
            ElMessage.success("操作成功");
            handleCloseDialog()
          })
          .finally(() => ( loading.close()));
      } else {
        rentalRequestsAPI.update(props.id, formData.value)
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
