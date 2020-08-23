import request from "@/utils/request";

export default {
  // 获取组别列表
  getList() {
    return request({
      url: "/team/list",
      method: "get"
    });
  },

  // 分页搜索方法
  search(page, size, searchMap) {
    return request({
      url: `/team/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },
  // 新增组别
  add(pojo) {
    return request({
      url: "/team",
      method: "post",
      data: pojo
    });
  },

  // 通过 ID 查询组别信息
  getById(id) {
    return request({
      url: `/team/${id}`,
      method: "get"
    });
  },

  // 修改组别信息
  update(pojo) {
    return request({
      url: `/team/${pojo.id}`,
      method: "put",
      data: pojo
    });
  },

  // 通过 ID 删除组别
  deleteById(id) {
    return request({
      url: `/team/${id}`,
      method: "delete"
    });
  }
};
