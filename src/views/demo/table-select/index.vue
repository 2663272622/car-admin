<!-- 列表选择器示例 -->
<script setup lang="ts">
import selectConfig from "./config/select";

interface IUser {
  id: number;
  username: string;
  nickname: string;
  mobile: string;
  genderLabel: string;
  avatar: string;
  email: string | null;
  status: number;
  deptName: string;
  roleNames: string;
  createTime: string;
}
const selectedUser = ref<IUser>();
function handleConfirm(data: IUser[]) {
  selectedUser.value = data[0];
}
const text = computed(() => {
  return selectedUser.value
    ? `${selectedUser.value.username} - ${selectedUser.value.genderLabel} - ${selectedUser.value.deptName}`
    : "";
});
</script>

<template>
  <div class="app-container"> 
    <table-select :text="text" :select-config="selectConfig" @confirm-click="handleConfirm">
      <template #status="scope">
        <el-tag :type="scope.row[scope.prop] == 1 ? 'success' : 'info'">
          {{ scope.row[scope.prop] == 1 ? "启用" : "禁用" }}
        </el-tag>
      </template>
    </table-select>
  </div>
</template>
