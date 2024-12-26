import DeptAPI from "@/api/system/dept";
import type { ISearchConfig } from "@/components/CURD/types";

const searchConfig: ISearchConfig = {
  pageName: "sys:user",
  formItems: [
    {
      type: "input",
      label: "关键字",
      prop: "keywords",
      attrs: {
        placeholder: "用户名/昵称/手机号",
        clearable: true,
        style: {
          width: "200px",
        },
      },
    },
    
    {
      type: "date-picker",
      label: "创建时间",
      prop: "createAt",
      attrs: {
        type: "daterange",
        "range-separator": "~",
        "start-placeholder": "开始时间",
        "end-placeholder": "截止时间",
        "value-format": "YYYY-MM-DD",
        style: {
          width: "240px",
        },
      },
    },
  ],
};

export default searchConfig;
