<template>
  <div class="team">
    <!-- 搜索框 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline" style="margin-top:20px">
      <!-- inline：一行显示 -->
      <!-- 重置表单看 el-form-item 组件元素的prop上是否指定了字段名，指定了重置才会生效 -->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="组名" style="width:200px" clearable></el-input>
      </el-form-item>
      <el-form-item prop="linkman" v-if="!isDialog">
        <el-input v-model="searchMap.linkman" placeholder="负责人" style="width:200px" clearable></el-input>
      </el-form-item>
      <el-form-item prop="mobile" v-if="!isDialog">
        <el-input v-model="searchMap.mobile" placeholder="联系电话" style="width:200px" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData()">查询</el-button>
      </el-form-item>
      <el-form-item v-if="!isDialog">
        <el-button type="primary" @click="handleAdd()">新增</el-button>
      </el-form-item>
      <el-form-item v-if="!isDialog">
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表单 -->
    <el-table
      :data="teamlist"
      :height="!isDialog ? 700 : 400"
      style="width: 100%"
      border
      :highlight-current-row="isDialog"
      @current-change="clickCurrentChange"
    >
      <!-- highlight-current-row 激活单选行，
            @current-change=""，当单击某一行后，会触发这个事件，从而调用对应的函数 handleCurrentChange，
            handleCurrentChange 会接收两个参数currentRow，oldCurrentRow。-->

      <!-- type="index" 获取索引值，label显示标题 -->
      <el-table-column type="index" label="序号" :width="!isDialog ? 100 : 50" align="center"> </el-table-column>
      <el-table-column prop="name" label="组名" :width="!isDialog ? 200 : ''" align="center"> </el-table-column>
      <el-table-column prop="linkman" label="负责人" :width="!isDialog ? 200 : ''" align="center"> </el-table-column>
      <el-table-column prop="mobile" label="联系电话" width="200" v-if="!isDialog" align="center"> </el-table-column>
      <el-table-column prop="remark" label="备注" width="300" v-if="!isDialog" align="center"> </el-table-column>
      <!-- 编辑选项 -->
      <el-table-column label="操作" v-if="!isDialog && this.$store.state.user.user.permission === 1" align="center" >
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
      :layout="!isDialog ? 'total, sizes, prev, pager, next, jumper' : 'prev, pager, next'"
      :total="total"
    >
    </el-pagination>
    <!-- 弹出新增窗口 -->
    <el-dialog title="组别编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
        :rules="rules"
        :model="pojo"
      >
        <!-- prop: 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的	 -->
        <el-form-item label="组名" prop="name">
          <el-input v-model="pojo.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="linkman">
          <el-input v-model="pojo.linkman" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="pojo.remark" clearable></el-input>
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
import teamApi from '@/api/team';

export default {
  props: {
    // 接收父组件传递过来的数据，通过其判断是否为弹框
    // true 为弹框
    isDialog: Boolean,
  },

  data() {
    return {
      teamlist: [],
      currentPage: 1,
      pageSize: 12,
      searchMap: {
        name: '',
        linkman: '',
        mobile: '',
      },
      total: 0,
      dialogFormVisible: false,
      pojo: {
        id: null,
        name: '',
        linkman: '',
        mobile: '',
        remark: '',
      },
      rules: {
        name: [{ required: true, message: '组别名称不能为空', trigger: 'blur' }],
        linkman: [{ required: true, message: '联系不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
      },
    };
  },

  components: {},

  methods: {
    fetchData() {
      // teamApi.getList().then((response) => {
      teamApi.search(this.currentPage, this.pageSize, this.searchMap).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          this.teamlist = resp.data.rows;
          this.total = resp.data.total;
        }
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
    // 重置表单
    resetForm(formName) {
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      // 重置会看 el-form-item 组件元素的prop上是否指定了字段名，指定了重置才会生效
      this.$refs[formName].resetFields();
      // 必须要手动清空id值，因为pojoForm中没有id，所以resetFields不能给id赋初始。
      this.pojo.id = null;
      console.log('表单已初始化');
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
    // 提交新增数据
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // TODO 提交数据
          teamApi.add(this.pojo).then((response) => {
            const resp = response.data;
            // 新增成功
            if (resp.flag) {
              // 弹出验证成功
              this.$message({
                message: '添加成功',
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
    // 编辑按钮，打开更新窗口
    handleEdit(id) {
      this.handleAdd();
      teamApi.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          // 成功获取要编辑的数据到弹窗
          this.pojo = resp.data;
        }
      });
    },
    // 更新会员记录
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交更新
          teamApi.update(this.pojo).then((response) => {
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
    // 删除按钮
    handleDelete(id) {
      this.$confirm('确认删除该记录？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      })
        .then(() => {
          //确认
          teamApi.deleteById(id).then((response) => {
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
    // 点击表单某一行时触发
    clickCurrentChange(currentRow) {
      // 自定义事件传递组别数据到父组件
      this.$emit('option-team', currentRow);
    },
  },

  created() {
    this.fetchData();
  },
};
</script>

<style scoped></style>
