<!-- 悬赏表 -->
<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="发布者/内容" prop="keywords">
          <el-input
            placeholder="发布者/内容"
            v-model="queryParams.keywords"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="选择学校" prop="tenantId"> 
          <schoolSelect  class="!w-[200px]" v-model="queryParams.tenantId"></schoolSelect>
        </el-form-item>
        <el-form-item label="订单状态" prop="rewardStatus">
          <dict-select v-model="queryParams.rewardStatus" code="rewardStatus" placeholder="请选择订单状态"></dict-select>
        </el-form-item> 
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
      <div class="mb-10px">
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
      </div>

      <el-table
        v-loading="loading"
        :data="tableList"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column prop="sort" label="排序" width="100" /> -->
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column prop="imagePath" label="主图" min-width="200">
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
        <el-table-column prop="schoolName" label="学校名称" min-width="150" />
        <el-table-column prop="createBy" label="发布者" width="150" />
        <el-table-column prop="pickupSide" label="接单员" width="150" />
        <el-table-column label="订单情况" width="100" align="center">
          <template #default="scope">
            <!-- 身份类型字典翻译 -->
            <DictLabel v-model="scope.row.rewardStatus" code="rewardStatus" />
          </template>
        </el-table-column>
        <el-table-column prop="rewardAmount" label="奖励金额" width="100" align="right"/>
        <el-table-column label="奖励类型" width="100" align="center">
          <template #default="scope">
            <!-- 奖励类型字典翻译 -->
            <DictLabel v-model="scope.row.rewardType" code="rewardType" />
          </template>
        </el-table-column>
        <el-table-column prop="contentDescription" label="内容" min-width="200" />
        <el-table-column prop="specifications" label="规格说明" min-width="200" />
        <el-table-column prop="pickupSide" label="取件地址"min-width="140" />
        <el-table-column prop="addressDetail" label="收件地址"min-width="140" />
        <el-table-column prop="createDate" label="创建日期" width="180" align="center">
          <template #default="scope">
            <span>{{ formatApplyDate(scope.row.createDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateDate" label="更新日期" width="180" align="center">
          <template #default="scope">
            <span>{{ formatApplyDate(scope.row.updateDate) }}</span>
          </template>
        </el-table-column>


        <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="scope"> 
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
import dictSelect from '@/components/Dict/index.vue'
import schoolSelect from "@/components/commonSelect/schoolSelect.vue";
import rewardsAPI,{QueryParams} from "@/api/system/client/rewards";
import {formatApplyDate}  from '@/utils/datedisplay';
import themeEdit from '@/views/order/rewards/edit.vue'
import { PREURL,IMG_BASE_URL } from "@/utils/const";
import { handleUrl } from "@/utils";
import { UploadRawFile, UploadUserFile, UploadFile, UploadProps } from "element-plus";
import schoolPagination from "@/components/commonSelect/schoolPagination.vue";

const queryFormRef = ref(ElForm);
const loading = ref(false);


const queryParams:QueryParams = reactive({
  tenantId:1,
  keywords:"",
  pageNum :1,
  pageSize :10,
  userName:"",
  identityType:"",
  rewardStatus:'',
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
    pageSize: queryParams.pageSize
  } 
  startTime && (params.startTime = startTime);
  endTime && (params.endTime = endTime);
  console.log(params)
  
  rewardsAPI.getPage(params).then((data:any) => {
    tableList.value = data.list;
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
  handleQuery();
}

const preData = ref({
  showPre:false,
  vIndex:-1,
  urls:[],
}) 

// // 预览图片
// const handlePictureCardPreview = (uploadFile: UploadFile,urls) => {
//   preData.value.urls = handleUrl(urls,false).map(i=>i.url)
//   preData.value.urls.map((item,index)=>item + PREURL == uploadFile.url && (preData.value.vIndex = index))
//   preData.value.showPre = true;
// };


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
      rewardsAPI.deleteByIds(ids)
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

</script>
