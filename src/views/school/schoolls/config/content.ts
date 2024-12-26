import UserAPI from "@/api/system/user";
import RoleAPI from "@/api/system/role";
import type { UserPageQuery } from "@/api/system/user";
import type { IContentConfig } from "@/components/CURD/types";
import TenantsAPI, { type TenantsListParams } from "@/api/system/school/tenants"; 

const contentConfig: IContentConfig<TenantsListParams> = {
  pageName: "tenants:add",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  pagination: {
    background: true,
    layout: "prev,pager,next,jumper,total,sizes",
    pageSize: 20,
    pageSizes: [10, 20, 30, 50],
  },
  indexAction: function (params) {
    return TenantsAPI.getPage(params);
  },
  deleteAction: UserAPI.deleteByIds,
  importAction(file) {
    return UserAPI.import(1, file);
  },
  exportAction: UserAPI.export,
  importTemplate: UserAPI.downloadTemplate,
  importsAction(data) {
    // 模拟导入数据
    console.log("importsAction", data);
    return Promise.resolve();
  },
  exportsAction: async function (params) {
    // 模拟获取到的是全量数据
    const res = await UserAPI.getPage(params);
    console.log("exportsAction", res.list);
    return res.list;
  },
  pk: "id",
  toolbar: [
    "add",
    "delete",
    "import",
    "export",
    // {
    //   name: "custom1",
    //   icon: "plus",
    //   text: "自定义1",
    //   auth: "import",
    //   type: "info",
    // },
  ],
  defaultToolbar: ["refresh", "filter", "imports", "exports", "search"],
  cols: [
    { type: "selection", width: 50, align: "center" },
    // { label: "学校名称", align: "center", prop: "name", width: 100, show: false },
    { label: "学校名称", align: "center", prop: "name", width: 100 },
    { label: "学校位置", align: "center", prop: "position" },
    { label: "头像", align: "center", prop: "avatar", templet: "image" }, 
    {
      label: "角色",
      align: "center",
      prop: "roleNames",
      width: 120,
      columnKey: "roleIds",
      filters: [],
      filterMultiple: true,
      filterJoin: ",",
      async initFn(colItem) {
        const roleOptions = await RoleAPI.getOptions();
        colItem.filters = roleOptions.map((item) => {
          return { text: item.label, value: item.value };
        });
      },
    },
    {
      label: "手机号码",
      align: "center",
      prop: "mobile",
      templet: "custom",
      slotName: "mobile",
      width: 150,
    },
    {
      label: "状态",
      align: "center",
      prop: "status",
      templet: "custom",
      slotName: "status",
    },
    { label: "创建时间", align: "center", prop: "createTime", width: 180 },
    {
      label: "操作",
      align: "center",
      fixed: "right",
      width: 220,
      templet: "tool",
      operat: [
        {
          name: "reset_pwd",
          auth: "password:reset",
          icon: "refresh-left",
          text: "重置密码",
        },
        "edit",
        "delete",
      ],
    },
  ],
};

export default contentConfig;
