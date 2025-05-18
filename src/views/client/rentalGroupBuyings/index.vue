<!-- 挪车小程序商家管理 -->
<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" props="keywords">
          <el-input
            v-model="queryParams.keywords"
            placeholder="请输入关键字查询"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <!-- <el-form-item label="商户名称" prop="merchantName">
          <el-input
            v-model="queryParams.merchantName"
            placeholder="请输入商户名称"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="商户电话" prop="contactPhone">
          <el-input
            v-model="queryParams.contactPhone"
            placeholder="请输入商户电话"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="商户地址" prop="storeAddress">
          <el-input
            v-model="queryParams.storeAddress"
            placeholder="请输入商户地址"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="经营业务" prop="businessScope">
          <Dict v-model="queryParams.businessScope" code="businessScope" class="!w-[100px]"/>
        </el-form-item> -->
        <!-- <el-form-item label="商家状态" prop="active">
          <el-select v-model="queryParams.active"  placeholder="全部" clearable class="!w-[100px]">
            <el-option :value=true label="已激活" />
            <el-option :value=false label="未激活" />
          </el-select>
        </el-form-item>  -->
        <el-form-item label="查询时间范围" prop="createTime"> 
          <el-date-picker
            v-model="datePicker"
            type="datetimerange" 
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format ="YYYY-MM-DD HH:mm:ss" 
          />
        </el-form-item>
        
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">
            搜索
          </el-button>
          <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <!-- <div class="mb-10px">
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
      </div> -->

      <el-table
        v-loading="loading"
        :data="tableList"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column prop="storeLogoUrl" label="商店图标" min-width="200">
          <template #default="scope">
            <el-upload
              class="table-pre"
              :file-list="scope.row.storeLogoUrl"
              list-type="picture-card"
              disabled
              multiple
              :on-preview="(uploadFile)=>handlePictureCardPreview(uploadFile,scope.row.storeLogoUrl)"
              /> 
          </template>
        </el-table-column>  -->
        <el-table-column prop="currentPeopleCount" label="已有人数" min-width="150" />
        <el-table-column label="团购状态" min-width="200" align="center" prop="groupStatus">
          <template #default="scope">
              <DictLabel v-model="scope.row.groupStatus" code="groupStatus" />
          </template>
        </el-table-column>
        <el-table-column prop="schoolName" label="学校名称" width="150" />
<!--         
        <el-table-column prop="popularBusinessDistrict" label="热门商圈" min-width="150" />
        <el-table-column prop="contactInfo" label="联系方式" min-width="150" />
        <el-table-column prop="expectedPrice" label="租房预算" min-width="150" />
        
        <el-table-column prop="moveInDate" label="入住时间" width="100" align="center">
          <template #default="scope">
            <span>{{scope.row.moveInDate }}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="openTime" label="开门时间" width="100" align="center">
          <template #default="scope">
            <span>{{ formatTimeFromArray(scope.row.openTime) }}</span>
          </template>
        </el-table-column> --> 
        <!-- <el-table-column prop="acceptFluctuation" label="接受波动时间" width="80" fixed="right">
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
        </el-table-column> -->
        
        <el-table-column prop="createDate" label="创建日期" width="180">
          <template #default="scope">
            <span>{{ formatApplyDate(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateDate" label="更新日期" width="180">
          <template #default="scope">
            <span>{{ formatApplyDate(scope.row.updateDate) }}</span>
          </template>
        </el-table-column>



        <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="scope"> 
              <!-- v-hasPerm="['sys:dept:edit']" -->
            <el-button
              type="primary"
              link
              size="small"
              icon="edit"
              @click.stop="handleMatching( scope.row.id)"
            >
              匹配成功
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
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Theme",
  inheritAttrs: false,
});

import rentalGroupBuyingsAPI from "@/api/system/client/rentalGroupBuyings";
import {formatApplyDate}  from '@/utils/datedisplay';
import themeEdit from '@/views/client/rentalGroupBuyings/edit.vue'
import { PREURL,IMG_BASE_URL } from "@/utils/const";
import { handleUrl } from "@/utils";
import { UploadRawFile, UploadUserFile, UploadFile, UploadProps } from "element-plus";
import schoolPagination from "@/components/commonSelect/schoolPagination.vue";
import {ref,computed} from "vue";
const queryFormRef = ref(ElForm);
const loading = ref(false);


const queryParams:any = reactive({
  pageNum :1,
  pageSize :10,
  keywords: "",
  merchantName: "",
  contactPhone: "",
  storeAddress: "",
  active: "",
  createTime: [],
  updateTime: [],
});
const datePicker = ref([])


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
  let [ startTime = '', endTime = '' ] = datePicker.value;
  let params = {
    ...queryParams,
    pageNum: queryParams.pageNum,
    pageSize: queryParams.pageSize,

    
  } 
  startTime && (params.startTime = startTime);
  endTime && (params.endTime = endTime);
  console.log(params)
  rentalGroupBuyingsAPI.getPage(params).then((data:any) => {
    // debugger
    // data.list.map((item:any) =>{
    //   if(item.businessScope){
    //     item.businessScope=item.businessScope.split(',')
    //   }
    // })
    // data.list.map((item:any) => {
    //   if (item.storeLogoUrl) {
    //     if (item.storeLogoUrl.includes('http:')) {
    //       return item.storeLogoUrl = item.storeLogoUrl.split(',').filter(i=>i).map(i=>({url:i,name:''}))
    //     }
    //     else {
    //       return item.storeLogoUrl = item.storeLogoUrl ? handleUrl(item.storeLogoUrl):''
    //     }
    //   }
    //   console.log(item.storeLogoUrl)
    // })
    tableList.value = data.list;
    console.log(tableList.value)
    total.value = data.total;
    loading.value = false;
  });
}
handleQuery()
// 重置查询时重置页码
function handleResetQuery() {
  datePicker.value = []; 
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1; // 重置页码到第一页
  queryParams.keywords = ""; // 重置关键字
  handleQuery();
}

const preData = ref({
  showPre:false,
  vIndex:-1,
  urls:[],
}) 

// 预览图片
const handlePictureCardPreview = (uploadFile: UploadFile,urls) => {
  preData.value.urls = urls.map(i=>i.url)
  preData.value.urls.map((item,index)=>item == uploadFile.url && (preData.value.vIndex = index))
  preData.value.showPre = true;
};


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

function handleMatching(id?: number) {
  ElMessageBox.confirm("确认已匹配成功?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      rentalGroupBuyingsAPI.setMatching(id)
        .then(() => {
          ElMessage.success("操作成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
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
      rentalGroupBuyingsAPI.deleteByIds(ids)
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

function formatTimeFromArray(timeArray) {
  // if (!timeArray) {
  //   return ""; 
  // }
  // else{
  //   while (timeArray.length < 2) {
  //   timeArray.push(0);
  // }
  // let [hours, minutes] = timeArray.map(num => String(num).padStart(2, '0'));
  // return `${hours}:${minutes}`;
  // }
}

</script>
