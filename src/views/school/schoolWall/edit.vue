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
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="formData.content" type="textarea" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="图片" prop="imagePath">
        <schoolUpload  parantPath="wall" v-model="formData.imagePath" max="9"></schoolUpload>
      </el-form-item>
      <el-form-item label="相关话题" prop="themeId">
        <el-select class="!w-full"
        v-model="formData.themeTitle"
        filterable
        remote
        clearable
        reserve-keyword
        placeholder="请选择相关话题"
        :remote-method="remoteMethod"
        :loading="loading"
        style="width: 240px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      </el-form-item>
      <el-form-item label="评论数量" prop="commentCount" v-if="props.type !== 'add'">
        <el-input-number class="!w-full" v-model="formData.commentCount" :precision="0" :step="1" :min="0" />
      </el-form-item>
      <el-form-item label="点赞数量" prop="likes" v-if="props.type !== 'add'">
        <el-input-number class="!w-full" v-model="formData.likes" :precision="0" :step="1" :min="0" />
      </el-form-item>
      <el-form-item label="浏览量" prop="views" v-if="props.type !== 'add'">
        <el-input-number class="!w-full" v-model="formData.views" :precision="0" :step="1" :min="0" />
      </el-form-item>
      <el-form-item label="热度" prop="heat"  v-if="props.type !== 'add'">
        <el-input-number class="!w-full" v-model="formData.heat" :precision="0" :step="1" :min="0" />
      </el-form-item>
      <el-form-item label="积分" prop="integral" v-if="props.type !== 'add'">
        <el-input-number class="!w-full" v-model="formData.integral" :precision="0" :step="1" :min="0" />
      </el-form-item>

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
import schoolUpload from "@/components/commonSelect/schoolUpload.vue";
import schoolSelect from "@/components/commonSelect/schoolSelect.vue";
import SchoolWallAPI from "@/api/system/school/schoolwall";
import { ElLoading } from "element-plus";
import SchoolThemeAPI,{QueryParams} from "@/api/system/client/carMoveCodes";
import { th } from "element-plus/es/locale";
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
content: [{ required: true, message: "话题内容不能为空", trigger: "blur" }],
imagePath: [{ required: true, message: "图片不能为空", trigger: "blur" }],
});

const formKey = ref(-1)

const getInfo = async() =>{
  if(!props.id) return;
  const res = await SchoolWallAPI.getFormData(props.id) 
  formData.value = res
  formKey.value = Math.random()
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
      SchoolWallAPI.add(formData.value).then((res) => {
          ElMessage.success("操作成功");
          handleCloseDialog()
        })
        .finally(() => ( loading.close()));
    } else {
      SchoolWallAPI.update(props.id, formData.value)
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
  themeTitle:[],
  likes:0,
  comment:0,
  views:0,
  heat:0,
  integral:0,
}
}

//获取话题列表
const titleList = ref([]);
let themeTitle = [];
const loading = ref(false)
function handleQuery() {
  loading.value = true;
  SchoolThemeAPI.getPage({
    tenantId :"1",
    pageNum: 1,
    pageSize: 1000,
  }).then((data:any) => {
    loading.value = false;
    data.list.forEach((item:any) => {
      themeTitle.push({ value: `${item.id}`, label: `${item.title}` });
    })
  console.log(themeTitle)
  });
}
handleQuery()

const options = ref([])
const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options.value = themeTitle.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options.value = []
  }
}
</script>

<style lang="scss" scoped></style>
