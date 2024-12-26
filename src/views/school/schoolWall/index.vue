<!-- 话题管理 -->
<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="内容标题" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入内容标题"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="话题搜索" prop="themeTitle">
          <el-input
            v-model="queryParams.themeTitle"
            placeholder="请输入话题"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="选择学校" prop="tenantId"> 
          <schoolSelect  class="!w-[200px]" v-model="queryParams.tenantId"></schoolSelect>
        </el-form-item>

        <!-- <el-form-item label="内容状态" prop="status">
          <el-select v-model="queryParams.status"  placeholder="全部" clearable class="!w-[100px]">
            <el-option :value="1" label="正常" />
            <el-option :value="0" label="禁用" />
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
        :border="true"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column prop="sort" label="排序" width="100" /> -->
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="imagePath" label="图片" min-width="200">
          <template #default="scope">
            <el-upload
              class="table-pre"
              :file-list="handleUrl(scope.row.imagePath)"
              list-type="picture-card"
              disabled
              multiple
              :on-preview="(uploadFile)=>handlePictureCardPreview(uploadFile,scope.row.imagePath)"
              /> 
          </template>
        </el-table-column> 
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="content" label="内容" min-width="200" />
        <el-table-column prop="schoolName" label="学校名称" min-width="200" />
        <!-- <el-table-column prop="ext1" label="附图" min-width="200" /> -->
        
        <el-table-column prop="commentCount" label="评论量" min-width="200" />
        <el-table-column prop="themeTitle" label="相关话题" min-width="200" />
        <el-table-column prop="likes" label="点赞数" min-width="200" />
        <el-table-column prop="views" label="浏览量" min-width="200" />
        <el-table-column prop="heat" label="热度" min-width="200" />
        <el-table-column prop="integral" label="积分" min-width="200" />
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


        <el-table-column label="操作" fixed="right" align="left" width="280">
          <template #default="scope"> 
            <el-button
              v-hasPerm="['sys:dept:edit']"
              type="primary"
              link
              size="small"
              icon="comment"
              @click.stop="handleOpenDialog('comment', scope.row.id)"
            >
              查看评论
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
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
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
import { PREURL,IMG_BASE_URL } from "@/utils/const";
import { handleUrl } from "@/utils";
import {formatApplyDate}  from '@/utils/datedisplay';
import schoolPagination from "@/components/commonSelect/schoolPagination.vue";
import schoolSelect from "@/components/commonSelect/schoolSelect.vue";
import SchoolWallAPI,{QueryParams} from "@/api/system/school/schoolwall";
import { UploadRawFile, UploadUserFile, UploadFile, UploadProps } from "element-plus";
import themeEdit from '@/views/school/schoolWall/edit.vue';
const queryFormRef = ref(ElForm);
const loading = ref(false);

// 话题分页列表的数据
const queryParams: QueryParams = reactive({
  tenantId:1,
  pageNum :1,
  pageSize :10,
  title: "",
  status: "",
  themeTitle: "",
});

const datePicker = ref([])


const tableList = ref([]); 

// 添加总数响应式变量
const total = ref(0);

// 添加对分页参数的监听
watch(
  () => [queryParams.pageNum, queryParams.pageSize],
  () => {
    handleQuery();
  }
);

// 查询
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
  
  SchoolWallAPI.getPage(params).then((data:any) => {
    tableList.value = data.list;
    total.value = data.total;
    loading.value = false;
  });
}
handleQuery()

// 重置查询
function handleResetQuery() {
  datePicker.value = []; 
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1; // 重置页码到第一页
  handleQuery();
}

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
  showEdit.value = true;
  dialog.type = type

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
      SchoolWallAPI.deleteByIds(ids)
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

const preData = ref({
  showPre:false,
  vIndex:-1,
  urls:[],
}) 
// 预览图片
const handlePictureCardPreview = (uploadFile: UploadFile,urls) => {
  preData.value.urls = handleUrl(urls,false).map(i=>i.url)
  preData.value.urls.map((item,index)=>item + PREURL == uploadFile.url && (preData.value.vIndex = index))
  preData.value.showPre = true;
};
</script>
