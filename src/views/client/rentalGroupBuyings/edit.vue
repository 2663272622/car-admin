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
      </el-form>
      
      <el-table 
        :data="tableList"
        row-key="id"
        default-expand-all 
      >
        <el-table-column type="selection" width="55" align="center" /> 
        <el-table-column prop="intendedCommunity" label="意向小区" min-width="150" />
        <el-table-column label="求租状态" min-width="200" align="center" prop="rentingStatus">
          <template #default="scope">
              <DictLabel v-model="scope.row.status" code="rentingStatus" />
          </template>
        </el-table-column>
        <el-table-column prop="workLocation" label="工作位置" width="150" />
        <el-table-column prop="popularBusinessDistrict" label="热门商圈" min-width="150" />
        <el-table-column prop="contactInfo" label="联系方式" min-width="150" />
        <el-table-column prop="expectedPrice" label="租房预算" min-width="150" />
        <el-table-column prop="moveInDate" label="入住时间" width="100" align="center">
          <template #default="scope">
            <span>{{scope.row.moveInDate }}</span>
          </template>
        </el-table-column> 
        <el-table-column prop="acceptFluctuation" label="接受波动时间" width="80" fixed="right">
          <template #default="scope">
            <el-tag v-if="scope.row.acceptFluctuation*1 === 1" type="success">接受</el-tag>
            <el-tag v-else type="danger">不接受</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isSharing" label="接受拼团" width="80" fixed="right">
          <template #default="scope">
            <el-tag v-if="scope.row.isSharing*1 === 1" type="success">接受</el-tag>
            <el-tag v-else type="danger">不接受</el-tag>
          </template>
        </el-table-column>
         


        <!-- <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="scope"> 
            <el-button
              type="primary"
              link
              size="small"
              icon="edit"
              @click.stop="handleGroup(scope.row.id)"
            >
              设为已成团
            </el-button>
            <el-button
              v-hasPerm="['sys:dept:edit']"
              type="primary"
              link
              size="small"
              icon="edit"
              @click.stop="handleOpenDialog('edit',scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-hasPerm="['sys:dept:edit']"
              type="primary"
              link
              size="small"
              icon="View"
              @click.stop="handleOpenDialog('info',scope.row.id)"
            >
              查看
            </el-button>
            <el-button
              v-hasPerm="['sys:dept:delete']"
              type="danger"
              link
              size="small"
              icon="delete"
              @click.stop="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
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
// import rentalGroupBuyingsAPI from "@/api/system/client/carMerchants";
import { ElLoading } from "element-plus";
import type { FormRules } from 'element-plus'
import schoolUpload from "@/components/commonSelect/schoolUpload.vue";
import checkCoord from "@/components/checkCoord/index.vue";
import rentalGroupBuyingsAPI from "@/api/system/client/rentalGroupBuyings";
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
const tableList = ref([])
const getInfo = async() =>{
  if(!props.id) return;
  nowBought.value=0
  const res = await rentalGroupBuyingsAPI.getFormData(props.id) 
  console.log(res,'详情')
  tableList.value = res.rentalRequestVOS
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
      if (props.type == 'add') {
        console.log(formData.value)
        rentalGroupBuyingsAPI.add(formData.value).then((res) => {
            ElMessage.success("操作成功");
            handleCloseDialog()
          })
          .finally(() => ( loading.close()));
      } else {
        rentalGroupBuyingsAPI.update(props.id, formData.value)
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
