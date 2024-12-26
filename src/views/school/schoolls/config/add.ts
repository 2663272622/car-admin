// import UserAPI, { type UserForm } from "@/api/system/user";
import type { IModalConfig } from "@/components/CURD/types";
import TenantsAPI, { type TenantsItem } from "@/api/system/school/tenants"; 

const modalConfig: IModalConfig<TenantsItem> = {
  pageName: "tenants:add",
  dialog: {
    title: "新增校园",
    width: 800,
    draggable: true,
  },
  form: {
    labelWidth: 100,
  },
  formAction: TenantsAPI.add,
  beforeSubmit(data) {
    console.log("提交之前处理", data);
  },
  formItems: [
    {
      label: "校园名称",
      prop: "name",
      rules: [{ required: true, message: "名称不能为空", trigger: "blur" }],
      type: "input",
      attrs: {
        placeholder: "请输入名称",
      },
      col: {
        xs: 24,
        sm: 12,
      },
    },
    {
      label: "位置",
      prop: "position",
      rules: [{ required: true, message: "位置不能为空", trigger: "blur" }],
      type: "coord",
      attrs: {
        placeholder: "请输入内容",
      },
      col: {
        xs: 24,
        sm: 12,
      },
    }, 
  ],
};

// 如果有异步数据会修改配置的，推荐用reactive包裹，而纯静态配置的可以直接导出
export default reactive(modalConfig);
