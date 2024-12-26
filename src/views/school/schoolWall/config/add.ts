import UserAPI, { type UserForm } from "@/api/system/user";
import type { IModalConfig } from "@/components/CURD/types";

const modalConfig: IModalConfig<UserForm> = {
  pageName: "sys:user",
  dialog: {
    title: "新增话题",
    width: 800,
    draggable: true,
  },
  form: {
    labelWidth: 100,
  },
  formAction: UserAPI.add,
  beforeSubmit(data) {
    console.log("提交之前处理", data);
  },
  formItems: [
    {
      label: "标题",
      prop: "title",
      rules: [{ required: true, message: "标题不能为空", trigger: "blur" }],
      type: "input",
      attrs: {
        placeholder: "请输入标题",
      },
      col: {
        xs: 24,
        sm: 12,
      },
    },
    {
      label: "内容",
      prop: "content",
      rules: [{ required: true, message: "内容不能为空", trigger: "blur" }],
      type: "input",
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
