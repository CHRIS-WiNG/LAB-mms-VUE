<template>
  <div class="account">
    <!-- 搜索框 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline" style="margin-top:20px">
      <!-- inline：一行显示 -->
      <!-- 重置表单看 el-form-item 组件元素的prop上是否指定了字段名，指定了重置才会生效 -->
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="账号" style="width:200px" clearable></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名" style="width:200px" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd()">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表单 -->
    <el-table :data="accountList" height="700" style="width: 100%" border >
      <!-- type="index" 获取索引值，label显示标题 -->
      <el-table-column type="index" label="序号" width="100" align="center"> </el-table-column>
      <el-table-column prop="username" label="账号" width="200" align="center"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="200" align="center"> </el-table-column>
      <el-table-column prop="identity" label="身份" width="200" align="center">
        <template slot-scope="scope">
          <!-- 过滤器实现将身份类型由id转为name -->
          <span>{{ scope.row.identity | identityFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="permission" label="权限" width="200" align="center">
        <template slot-scope="scope">
          <!-- 过滤器实现将权限类型由id转为name -->
          <span>{{ scope.row.permission | permissionFilter }}</span>
        </template>
      </el-table-column>
      <!-- 编辑选项 -->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[12, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 弹出新增窗口 -->
    <el-dialog title="账户编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
        :rules="rules"
        :model="pojo"
      >
        <!-- prop: 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的	 -->
        <el-form-item label="账号" prop="username">
          <el-input v-model="pojo.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="pojo.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="身份" prop="identity">
          <el-select v-model="pojo.identity" clearable placeholder="请选择" style="width: 100%">
            <el-option
              v-for="option in identityOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限" prop="permission">
          <el-select v-model="pojo.permission" clearable placeholder="请选择" style="width: 100%">
            <el-option
              v-for="option in permissionOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="pojo.identity == '1' ? '学号' : '教工号'" prop="identityNum">
          <el-input v-model="pojo.identityNum" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button type="primary" @click="pojo.id == null ? addData('pojoForm') : updateData('pojoForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import accountApi from '@/api/account';

// 身份
const identityOptions = [
  { type: 1, name: '学生' },
  { type: 2, name: '教师' },
];

const permissionOptions = [
  { type: 0, name: '用户' },
  { type: 1, name: '管理员' },
];
export default {
  data() {
    return {
      accountList: [],
      total: 0, // 总记录数
      currentPage: 1,
      pageSize: 12, //
      searchMap: {
        username: '',
        name: '',
      }, //条件查询绑定的条件值
      // 不要忘记将 payTypeOptions 绑定到data中
      dialogFormVisible: false, //控制新增对话框
      identityOptions,
      permissionOptions,
      pojo: {
        id: null,
        username: '',
        name: '',
        email: '',
        password: '123456',
        identity: '',
        permission: 0,
        identityNum: null,
      }, //提交的数据
      rules: {
        username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
        identity: [{ required: true, message: '身份不能为空', trigger: 'change' }],
        permission: [{ required: true, message: '权限不能为空', trigger: 'change' }],
        identityNum: [{ required: true, message: '该属性不能为空', trigger: 'change' }],
      }, //新增账户窗口的校验规则
    };
  },

  created() {
    this.fetchData();
  },

  components: {},

  methods: {
    // 获取数据
    fetchData() {
      // 调用分页查询数据
      accountApi.search(this.currentPage, this.pageSize, this.searchMap).then((response) => {
        const resp = response.data;
        this.accountList = resp.data.rows;
        this.total = resp.data.total;
      });
    },
    // 当每页显示条数改变后被触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    // 当页码改变后被触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    // 弹出新增窗口
    handleAdd() {
      this.dialogFormVisible = true;
      // this.$nextTick(() 是异步事件
      // 弹出窗口打开后需要加载Dom，就需要花费一点时间
      // 我们就应该等待它加载完成后，在进行调用resetFields方法，充值表单和清除样式
      // this.$nextTick(()，能够让Dom先渲染完毕，再执行回调函数
      this.$nextTick(() => {
        this.resetForm('pojoForm'); // 复用代码
      });
    },
    // 编辑按钮，打开编辑窗口
    handleEdit(id) {
      this.handleAdd();
      accountApi.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          // 成功获取要编辑的数据到弹窗
          this.pojo = resp.data;
        }
      });
    },
    // 删除按钮
    handleDelete(id) {
      this.$confirm('确认删除该记录？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      })
        .then(() => {
          //确认
          accountApi.deleteById(id).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              // 删除成功
              this.fetchData();
            }
            // 消息提示成功或失败
            this.$message({
              message: resp.message,
              type: resp.flag ? 'success' : 'error',
            });
          });
        })
        .catch(() => {
          //取消，不用理会
        });
    },
    // 重置表单
    resetForm(formName) {
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      // 重置会看 el-form-item 组件元素的prop上是否指定了字段名，指定了重置才会生效
      this.$refs[formName].resetFields();
      //
      this.pojo.id = null;
      this.pojo.password = '123456';
      this.pojo.identity = '';
      this.pojo.permission = 0;
      console.log('表单已初始化');
    },
    // 提交新增数据
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // TODO 提交数据
          accountApi.add(this.pojo).then((response) => {
            const resp = response.data;
            // 新增成功
            if (resp.flag) {
              // 弹出验证成功
              this.$message({
                message: '新增成功, 初始密码为:123456',
                type: 'success',
              });
              // 刷新列表数据
              this.fetchData();
              // 关闭窗口
              this.dialogFormVisible = false;
            } else {
              // 新增失败
            }
          });
        } else {
          return;
        }
      });
    },
    //  更新账户记录
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交更新
          accountApi.update(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              // 提示更新成功
              this.$message({
                message: resp.message,
                type: 'success',
              });
              // 刷新列表
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: 'warning',
              });
            }
          });
        }
      });
    },
  },
  // 在过滤器中不能引用当前实例 this，this,levelOptions是错误的，所以要放在全局
  filters: {
    identityFilter(type) {
      const identityOption = identityOptions.find((obj) => {
        return obj.type == type;
      });
      return identityOption ? identityOption.name : null;
    },
    permissionFilter(type) {
      const permissionOption = permissionOptions.find((obj) => {
        return obj.type == type;
      });
      return permissionOption ? permissionOption.name : null;
    },
  },
};
</script>

<style scoped></style>
