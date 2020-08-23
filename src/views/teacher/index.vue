<template>
  <div class="teacher">
    <!-- 搜索框 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline" style="margin-top:20px">
      <!-- inline：一行显示 -->
      <!-- 重置表单看 el-form-item 组件元素的prop上是否指定了字段名，指定了重置才会生效 -->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名" style="width:200px" clearable></el-input>
      </el-form-item>
      <el-form-item prop="tchNum">
        <el-input v-model="searchMap.tchNum" placeholder="教工号" style="width:200px" clearable></el-input>
      </el-form-item>
      <el-form-item prop="level">
        <el-select v-model="searchMap.level" clearable placeholder="职称" style="width:150px">
          <el-option
            v-for="option in levelOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
            clearable
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="teamName">
        <!-- 注意：el-input是组件，要在组件元素监听原生事件(点击事件等)，需要使用 @:原生事件名.native="处理函数" -->
        <el-input
          readonly
          v-model="searchMap.teamName"
          @click.native="dialogTeamVisible = true"
          placeholder="选择所在组"
          style="width:200px"
        ></el-input>
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
    <el-table :data="teacherList" height="700" style="width: 100%" border>
      <!-- type="index" 获取索引值，label显示标题 -->
      <el-table-column type="index" label="序号" width="100" align="center"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="150" align="center"> </el-table-column>
      <el-table-column prop="tchNum" label="教工号" width="200" align="center"> </el-table-column>
      <el-table-column prop="mobile" label="手机号码" width="200" align="center"> </el-table-column>
      <el-table-column prop="email" label="邮箱" width="250" align="center"> </el-table-column>
      <el-table-column prop="office" label="办公室" width="200" align="center"> </el-table-column>
      <el-table-column prop="level" label="职称" width="150" align="center">
        <template slot-scope="scope">
          <!-- 过滤器实现将学历类型由id转为name -->
          <span>{{ scope.row.level | levelFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="teamName" label="所在组" width="200" align="center"> </el-table-column>
      <!-- 编辑选项 -->
      <el-table-column label="操作" align="center" v-if="this.$store.state.user.user.permission === 1">
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
    <el-dialog title="教师编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
        :rules="rules"
        :model="pojo"
      >
        <!-- prop: 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的	 -->
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="教工号" prop="tchNum">
          <el-input v-model="pojo.tchNum" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="pojo.mobile" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="pojo.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="办公室" prop="office">
          <el-input v-model="pojo.office" clearable></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="level">
          <el-select v-model="pojo.level" clearable placeholder="请选择职称">
            <el-option
              v-for="option in levelOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在组" prop="teamName">
          <el-input
            readonly
            @click.native="editOptionTeam()"
            v-model="pojo.teamName"
            placeholder="选择所在组"
          ></el-input>
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
    <!-- 所在组对话框 -->
    <el-dialog title="选择所在组" :visible.sync="dialogTeamVisible" width="500px">
      <!-- optionTeam不能加括号 -->
      <team @option-team="optionTeam" :isDialog="true"></team>
    </el-dialog>
  </div>
</template>

<script>
import teacherApi from '@/api/teacher';
import Team from '@/views/team';
// 职级类型
const levelOptions = [
  { type: 1, name: '讲师' },
  { type: 2, name: '研究员' },
  { type: 3, name: '副教授' },
  { type: 4, name: '教授' },
];
export default {
  data() {
    return {
      teacherList: [],
      pageSize: 12,
      currentPage: 1,
      searchMap: {
        name: '',
        tchNum: '',
        teamId: null,
        teamName: '',
        level: '',
      },
      total: 0,
      dialogFormVisible: false,
      dialogTeamVisible: false, // 弹出选择所在组
      levelOptions,
      pojo: {
        id: null,
        name: '',
        tchNum: '',
        mobile: '',
        email: '',
        level: '',
        teamName: '',
        office: '',
        teamId: null,
        uid: null,
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        tchNum: [{ required: true, message: '教工号不能为空', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
      },
      isEdit: false, // 判断所在组弹框是否来自编辑窗口，true 是，false：否，来自搜索窗口
    };
  },
  // 注册子组件
  components: {
    Team,
  },

  methods: {
    fetchData() {
      teacherApi.search(this.currentPage, this.pageSize, this.searchMap).then((response) => {
        const data = response.data.data;
        this.teacherList = data.rows;
        this.total = data.total;
      });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },

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
      this.pojo.uid = null;
      this.pojo.teamId = null;
      this.searchMap.teamId = null;
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
          teacherApi.add(this.pojo).then((response) => {
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
      teacherApi.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          // 成功获取要编辑的数据到弹窗
          this.pojo = resp.data;
        }
      });
    },
    // 更新教师记录
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交更新
          teacherApi.update(this.pojo).then((response) => {
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
          teacherApi.deleteById(id).then((response) => {
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
    // 自定义事件获取子组件 所在组的数据
    optionTeam(teamMsg) {
      if (this.isEdit) {
        // 如果是从新增或编辑进入的
        this.pojo.teamId = teamMsg.id;
        this.pojo.teamName = teamMsg.name;
      } else {
        // 如果是从搜索进入的
        this.searchMap.teamName = teamMsg.name;
        this.searchMap.teamId = teamMsg.id;
      }
      // isEdit要还原为false，不还原就变不回去了
      this.isEdit = false;
      this.dialogTeamVisible = false;
    },
    //
    editOptionTeam() {
      this.isEdit = true; //标志通过新增或编辑进入的所在组选择弹框
      this.dialogTeamVisible = true;
    },
  },

  created() {
    this.fetchData();
  },
  // 在过滤器中不能引用当前实例 this，this,levelOptions是错误的，所以要放在全局
  filters: {
    levelFilter(type) {
      const levelOption = levelOptions.find((obj) => {
        return obj.type == type;
      });
      return levelOption ? levelOption.name : null;
    },
  },
};
</script>

<style scoped></style>
