import request from "@/utils/request";

export default {
  getList() {
    return request({
      url: "/student/list",
      method: "get"
    });
  },

  // 分页搜索方法
  // page 当前页码，size 每页条数，searchMap条件查询的条件
  search(page, size, searchMap) {
    return request({
      url: `/student/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },

  // 新增学生
  // 返单引号和单引号都可以，返单引号可以拼接数据
  add(pojo) {
    return request({
      url: "/student",
      method: "post",
      data: pojo
    });
  },

  // 通过 ID 查询学生信息
  getById(id) {
    return request({
      url: `/student/${id}`,
      method: "get"
    });
  },

  // 更新数据
  update(pojo) {
    return request({
      url: `/student/${pojo.id}`,
      method: "put",
      data: pojo
    });
  },

  // 通过id删除学生记录
  deleteById(id) {
    return request({
      url: `/student/${id}`,
      method: "delete"
    });
  },
  // 根据UID获取教师记录
  getByUId(id) {
    return request({
      url: `/student/uid/${id}`,
      method: "get"
    });
  },
};
