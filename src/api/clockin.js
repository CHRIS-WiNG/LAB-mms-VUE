import request from "@/utils/request";

export default {
  // 分页条件查询
  search(page, size, searchMap) {
    return request({
      url: `/clockin/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },

  // 新增打卡
  add(pojo) {
    return request({
      url: "/clockin",
      method: "post",
      data: pojo
    });
  },
}