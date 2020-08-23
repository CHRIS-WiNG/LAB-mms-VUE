import request from "@/utils/request";

export default {
  // 分页条件查询
  search(page, size, searchMap) {
    return request({
      url: `/account/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },
  
  // 新增账户
  add(pojo) {
    return request({
      url: "/account",
      method: "post",
      data: pojo
    });
  },

  // 通过 ID 查询账户信息
  getById(id) {
    return request({
      url: `/account/${id}`,
      method: "get"
    });
  },

  // 修改账户信息
  update(pojo) {
    return request({
      url: `/account/${pojo.id}`,
      method: "put",
      data: pojo
    });
  },

  // 通过 ID 删除账户
  deleteById(id) {
    return request({
      url: `/account/${id}`,
      method: "delete"
    });
  }
};
