import request from "@/utils/request";
// 话题管理
const SchoolTheme_BASE_URL = "/api/v1/isThemes";

const SchoolThemeAPI = {   
  // 获取列表
  getPage(queryParams) {
      return request({
      url: `${SchoolTheme_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
 
  // 获取详情
  getFormData(id: number) {
    return request({
      url: `${SchoolTheme_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  // 添加
  add(data) {
    return request({
      url: `${SchoolTheme_BASE_URL}`,
      method: "post",
      data: data,
    });
  }, 

  // 更新 
  update(id: number, data) {
    return request({
      url: `${SchoolTheme_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  // 批量删除
  deleteByIds(ids: string) {
    return request({
      url: `${SchoolTheme_BASE_URL}/${ids}`,
      method: "delete",
    });
  },

  // /**
  //  * 发布通知
  //  *
  //  * @param id 被发布的通知公告id
  //  * @returns
  //  */
  // publish(id: number) {
  //   return request({
  //     url: `${SchoolTheme_BASE_URL}/${id}/publish`,
  //     method: "patch",
  //   });
  // },
 
};

export default SchoolThemeAPI
;

/** 校园话题表查新对象 */
export interface SchoolThemeListParams { 
  tenantId :string;
  pageNum :string;
  pageSize  :string;

  title?: string; 
  status?:string;
  createTime? :string;
  // {
  //   "id": 0,
  //   "tenantId": 0,
  //   "title": "string",
  //   "content": "string",
  //   "imagePath": "string",
  //   "likes": 0,
  //   "views": 0,
  //   "heat": 0,
  //   "integral": 0,
  //   "createDate": "2024-11-26T08:56:44.523Z",
  //   "updateDate": "2024-11-26T08:56:44.523Z",
  //   "createBy": "string",
  //   "updateBy": "string",
  //   "ext1": "string",
  //   "ext2": "string",
  //   "deleteFlag": true
  // }
}
/** 校园话题表新增对象 */
export interface SchoolThemeItem {
  id:string;
  themeId:string;
  title:string;
  content:string;
  comment:number;
  views:number;
  heat:number;
  frontUserId:string;
  createDate:string;
  updateDate:string;
  createBy:string;
  updateBy:string;
} 

/** 校园话题表分页对象 */
export interface SchoolThemeItem {
  id:string;
  themeId:string;
  title:string;
  content:string;
  comment:number;
  views:number;
  heat:number;
  frontUserId:string;
  createDate:string;
  updateDate:string;
  createBy:string;
  updateBy:string;
} 

export interface QueryParams{
  tenantId: number;
  pageNum: number;
  pageSize: number;
  title: string;
  status: string;
  startTime?: string; 
  endTime?: string;   
};
