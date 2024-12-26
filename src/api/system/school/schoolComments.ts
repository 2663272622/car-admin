import request from "@/utils/request";

const SchoolComments_BASE_URL = "/api/v1/isComments";

const SchoolCommentsAPI = {  
  /** 获取通知公告分页数据 */
  getPage(queryParams) {
    // return request<any, PageResult<SchoolWallItem[]>>({
      return request({
      url: `${SchoolComments_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 获取通知公告表单数据
   *
   * @param id NoticeID
   * @returns Notice表单数据
   */
  getFormData(id: number) {
    return request<any, any>({
      url: `${SchoolComments_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   * 添加话题
   */
  add(data: SchoolCommentsItem) {
    return request({
      url: `${SchoolComments_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新通知公告
   *
   * @param id NoticeID
   * @param data Notice表单数据
   */
  update(id: number, data) {
    return request({
      url: `${SchoolComments_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除通知公告，多个以英文逗号(,)分割
   *
   * @param ids 通知公告ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${SchoolComments_BASE_URL}/${ids}`,
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
  //     url: `${NOTICE_BASE_URL}/${id}/publish`,
  //     method: "patch",
  //   });
  // },
 
};

export default SchoolCommentsAPI
;

/** 校园话题表查新对象 */
export interface SchoolCommentsListParams { 
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
export interface SchoolCommentsItem {
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
export interface SchoolCommentsItem {
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
  tenantId: string;
  pageNum: number;
  pageSize: number;
  title: string;
  status: string;
  startTime?: string; 
  endTime?: string;   
};
