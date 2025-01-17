<!-- 挪车码管理carMoveCodes -->
<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="queryParams.keywords"
            placeholder="请输入手机号/车牌号"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="挪车码状态" prop="active">
          <el-select v-model="queryParams.active"  placeholder="全部" clearable class="!w-[100px]">
            <el-option :value=true label="已激活" />
            <el-option :value=false label="未激活" />
          </el-select>
        </el-form-item> 
        <el-form-item label="挪车码是否下载" prop="downloadFlag">
          <el-select v-model="queryParams.downloadFlag"  placeholder="全部" clearable class="!w-[100px]">
            <el-option :value=true label="已下载" />
            <el-option :value=false label="未下载" />
          </el-select>
        </el-form-item> 
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">
            搜索
          </el-button>
          <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
          <!-- <el-button icon="refresh" @click="handleNewCode">生成挪车吗</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <div class="mb-10px">
        <el-button
          v-hasPerm="['sys:dept:add']"
          type="success"
          icon="plus"
          @click="GenerateDialog = true"
        >
          批量生成
        </el-button>
        <el-button
          v-hasPerm="['sys:dept:add']"
          type="success"
          icon="plus"
          @click="handleOpenDialog('add')"
        >
          新增
        </el-button>
        <el-button
          v-hasPerm="['sys:dept:delete']"
          type="danger"
          :disabled="selectIds.length === 0"
          icon="delete"
          @click="handleDelete()"
        >
          删除
        </el-button>
        <el-button
          type="success"
          :disabled="selectIds.length === 0"
          icon="download"
          @click="handleDownload()"
        >
          批量下载
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="tableList"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column prop="imagePath" label="主图" width="200">
          <template #default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="`${IMG_BASE_URL + scope.row.imagePath + PREURL}`"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[`${IMG_BASE_URL + scope.row.imagePath }`]"
              :initial-index="4"
              fit="cover"
              :lazy="true"
              :preview-teleported	="true"
              :z-index="9999"
            />
          </template>
        </el-table-column>  -->
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="carNumber" label="车牌号" width="120" />
        <el-table-column prop="phoneNumber" label="联系电话" width="150" />
        <el-table-column prop="userAvatar" label="用户头像" min-width="100">
          <template #default="scope">
            <el-image
              style="width: 50px; height: 50px;border-radius: 50%;"
              :src="scope.row.userAvatar"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[scope.row.userAvatar]"
              :initial-index="4"
              fit="cover"
              :lazy="true"
              :preview-teleported	="true"
              :z-index="9999"
            />
          </template>
        </el-table-column> 
        <el-table-column prop="userName" label="用户姓名" min-width="150" />
        <el-table-column prop="wxPhoneNumber" label="微信手机号" width="120" />
        <el-table-column prop="messageText" label="消息通知" width="120" />
        <el-table-column prop="active" label="是否激活" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.active === true" type="success">激活</el-tag>
            <el-tag v-else-if="scope.row.active === false||scope.row.active === null" type="danger">未激活</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="banFlag" label="是否禁用" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.banFlag === true" type="danger">已禁用</el-tag>
            <el-tag v-else-if="scope.row.banFlag === false||scope.row.banFlag === null" type="success">已激活</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="banFlag" label="是否下载" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.ext1 === '0'" type="danger">未下载</el-tag>
            <el-tag v-else-if="scope.row.ext1=== '1'" type="success">已下载</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="usageCount" label="使用次数" width="100" align="center" />
        <el-table-column prop="updateDate" label="更新日期" width="180">
          <template #default="scope">
            <span>{{ formatApplyDate(scope.row.updateDate) }}</span>
          </template>
        </el-table-column>


        <el-table-column label="操作" fixed="right" align="left" width="250">
          <template #default="scope"> 
            <el-button
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
            <el-button
              type="primary"
              link
              size="small"
              icon="download"
              @click.stop="handleDownload(scope.row.id)"
            >
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <schoolPagination 
        v-model:page-no="queryParams.pageNum" 
        v-model:page-size="queryParams.pageSize" 
        :total="total"
      />
    </el-card>
    <themeEdit
      v-model="showEdit"
      :title="dialog.title"
      :type="dialog.type"
      :id="dialog.id"
      @reload="handleResetQuery"
    ></themeEdit>

    <el-image-viewer
      v-if="preData.showPre"
      :zoom-rate="1.2"
      :initialIndex="preData.vIndex"
      :url-list="preData.urls"
      @close="preData.showPre = false"
    /> 

    <div>
      <el-dialog
      width="600px"
      v-model="GenerateDialog"
      title="批量生成挪车码"
      @close="resetQuery"
      >
      <el-form ref="formRef" :model="Generate" label-width="100px">
        <el-form-item label="选择商家" prop="carMerchantId">
          <el-select
            v-model="Generate.carMerchantId"
            placeholder="请选择商家"
          >
            <el-option
              v-for="item in list"
              :key="item.userId"
              :label="item.merchantName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生成数量" prop="number">
          <el-input-number v-model="Generate.number" type="number" placeholder="请输入生成数量"  class="!w-full"/>
        </el-form-item>
      </el-form>
      <template #footer >
        <div>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="GenerateDialog = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    </div>
    <newcar v-model="showNewCar" :newcarcode="newcarcode"></newcar>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Theme",
  inheritAttrs: false,
});
import {formatApplyDate}  from '@/utils/datedisplay';
import carMoveCodesAPI from "@/api/system/client/carMoveCodes";
import themeEdit from '@/views/client/carMoveCodes/edit.vue'
import schoolPagination from "@/components/commonSelect/schoolPagination.vue";
import carMerchantsAPI from "@/api/system/client/carMerchants";
import { ElLoading } from "element-plus";
import newcar from './codecanvas/newcar.vue'

const showNewCar = ref(false)

const queryFormRef = ref(ElForm);
const loading = ref(false);


const queryParams: any = reactive({
  pageNum :1,
  pageSize :10,
});


const newcarcode = ref({})
const handleNewCode = (obj)=>{
  newcarcode.value = obj || {} 
  console.log("生成挪车吗")
  showNewCar.value = true
}


const tableList = ref([]); 
const total = ref(0);

// 添加对分页参数的监听
watch(
  () => [queryParams.pageNum, queryParams.pageSize],
  () => {
    handleQuery();
  }
);

// 修改查询函数，确保在查询时使用正确的分页参数
function handleQuery() {
  loading.value = true;
  let params = {
    ...queryParams,
    pageNum: queryParams.pageNum,
    pageSize: queryParams.pageSize
  } 
  carMoveCodesAPI.getPage(params).then((data:any) => {
    tableList.value = data.list;
    total.value = data.total;
    loading.value = false;
  });
}
handleQuery()

// 重置查询时重置页码
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1; // 重置页码到第一页
  handleQuery();
}

const preData = ref({
  showPre:false,
  vIndex:-1,
  urls:[],
}) 
// 处理选中项变化
const selectIds = ref<number[]>([]);
function handleSelectionChange(selection: any) {
  selectIds.value = selection.map((item: any) => item.id);
}

 
const showEdit = ref(false)
const dialog = reactive({title:"",type:"",id:-1})
async function handleOpenDialog(type,id?: number) {
  switch (type) {
    case "add":
      dialog.id = -1
      dialog.title = "新增";
    break;
    case "edit":
      dialog.id = id
      dialog.title = "编辑";
    break;
    case "info":
      dialog.id = id
      dialog.title = "查看";
    break;
  }
  dialog.type = type
  showEdit.value = true; 
}

// 删除学校
function handleDelete(id?: number) {
  const ids = [id || selectIds.value].join(",");

  if (!ids) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      carMoveCodesAPI.deleteByIds(ids)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

const GenerateDialog = ref(false)
const Generate:Generator = reactive({
  number:0,
})

interface Generator {
  number:number,
  carMerchantId?:number,
}

// 提交表单
function handleSubmit() {
  
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })  
  carMoveCodesAPI.generated(Generate.number,Generate.carMerchantId)
    .then((data) => {
      handleNewCode(data)
      ElMessage.success("操作成功");
      handleResetQuery();
    })
    .finally(() => (GenerateDialog.value = false,loading.close()));
} 

// 发送请求获取商家id
const params = {
  pageNum: 1,
  pageSize: 1000,
}
const list = ref([])
carMerchantsAPI.getPage(params).then((data:any) => {
    list.value = data.list;
    console.log(list.value)
  });

function resetQuery(){
  Generate.number = 0;
  Generate.carMerchantId = undefined;
  handleQuery();
}

// 下载挪车码
function handleDownload(id?:string){
  const ids = [id || selectIds.value].join(",");
  carMoveCodesAPI.download(ids).then((res: any) => {
    let blob = new Blob([res.data], { type: 'application/zip' });
    const url= window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', '挪车码.zip');
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
  });
}
</script>

