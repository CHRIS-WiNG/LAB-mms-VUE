<template>
  <!-- prop: 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的	 -->
  <div class="student">
    <!-- 搜索框 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline" style="margin-top:20px">
      <!-- inline：一行显示 -->
      <!-- 重置表单看 el-form-item 组件元素的prop上是否指定了字段名，指定了重置才会生效 -->
      <el-form-item prop="stuNum">
        <el-input v-model="searchMap.stuNum" placeholder="学号" style="width:200px" clearable></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名" style="width:200px" clearable></el-input>
      </el-form-item>
      <el-form-item prop="level">
        <el-select v-model="searchMap.level" clearable placeholder="学历" style="width:150px">
          <el-option
            v-for="option in levelOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="entryYear">
        <el-select v-model="searchMap.entryYear" clearable placeholder="入学年份" style="width:150px">
          <el-option
            v-for="option in entryYearOptions"
            :key="option.value"
            :label="option.value"
            :value="option.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="isGraduate">
        <el-select v-model="searchMap.isGraduate" clearable placeholder="是否毕业" style="width:150px">
          <el-option
            v-for="option in isGraduateOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
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
    <el-table :data="studentList" height="700" style="width: 100%" border @sort-change="tableSortChange">
      <!-- type="index" 获取索引值，label显示标题 -->
      <el-table-column type="index" label="序号" width="100" align="center"> </el-table-column>
      <el-table-column prop="stuNum" label="学号" width="120" align="center"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="100" align="center"> </el-table-column>
      <el-table-column prop="entryYear" label="入学年份" width="120" align="center"> </el-table-column>
      <el-table-column prop="clockinNum" label="本周打卡数" width="120" align="center" sortable="custom">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号码" width="140" align="center"> </el-table-column>
      <el-table-column prop="college" label="院系" width="140" align="center"> </el-table-column>
      <el-table-column prop="age" label="年龄" width="80" align="center">
        <template slot-scope="scope">
          <!-- 过滤器实现将生日转换为年龄 -->
          <span>{{ scope.row.birthday | ageFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isGraduate" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <!-- 过滤器实现将是否毕业的标识由id转为name -->
          <span>{{ scope.row.isGraduate | isGraduateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200" align="center"> </el-table-column>
      <el-table-column prop="level" label="学历" width="100" align="center">
        <template slot-scope="scope">
          <!-- 过滤器实现将学历类型由id转为name -->
          <span>{{ scope.row.level | levelFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="学生住址" align="center"> </el-table-column>
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
    <el-dialog title="学生编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
        :rules="rules"
        :model="pojo"
      >
        <!-- prop: 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的	 -->
        <el-form-item label="学号" prop="stuNum">
          <el-input v-model="pojo.stuNum" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="pojo.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="pojo.mobile" clearable></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="pojo.birthday"
            type="date"
            placeholder="选择生日"
            value-format="yyyy-MM-dd"
            style="width:100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="院系" prop="college">
          <el-input v-model="pojo.college" style="width:100%" clearable></el-input>
        </el-form-item>
        <el-form-item label="学历" prop="level">
          <el-select v-model="pojo.level" clearable placeholder="请选择学历" style="width:100%">
            <el-option
              v-for="option in levelOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入学年份" prop="entryYear">
          <el-select v-model="pojo.entryYear" clearable placeholder="请选择入学年份" style="width:100%">
            <el-option
              v-for="option in entryYearOptions"
              :key="option.value"
              :label="option.value"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否毕业" prop="isGraduate">
          <el-select v-model="pojo.isGraduate" clearable placeholder="请选择" style="width:100%">
            <el-option
              v-for="option in isGraduateOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学生住址" prop="address">
          <el-input type="textarea" v-model="pojo.address" clearable></el-input>
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
import studentApi from '@/api/student';

// 学历类型
const levelOptions = [
  { type: 1, name: '实习生' },
  { type: 2, name: '本科生' },
  { type: 3, name: '硕士生' },
  { type: 4, name: '博士生' },
];
const entryYearOptions = [
  { value: '2016' },
  { value: '2017' },
  { value: '2018' },
  { value: '2019' },
  { value: '2020' },
];
const isGraduateOptions = [
  { type: 1, name: '已毕业' },
  { type: 0, name: '未毕业' },
];

export default {
  data() {
    return {
      studentList: [],
      total: 0, // 总记录数
      currentPage: 1,
      pageSize: 12, //
      searchMap: {
        stuNum: '',
        name: '',
        level: '',
        entryYear: '',
        isGraduate: '',
        orderBy: '',
        order: '',
      }, //条件查询绑定的条件值
      // 不要忘记将 levelOptions 绑定到data中
      levelOptions, // levelOptions: levelOptions
      isGraduateOptions,
      entryYearOptions,
      dialogFormVisible: false, //控制新增对话框
      pojo: {
        id: null,
        stuNum: '',
        name: '',
        birthday: '',
        mobile: '',
        college: '',
        email: '',
        level: '',
        address: '',
        isGraduate: '',
        clockinNum: 0,
        entryYear: '',
        uid: null, // 账户id，重要
      }, //提交的数据
      rules: {
        stuNum: [{ required: true, message: '学号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
        // level: [{ required: true, message: '学历不能为空', trigger: 'change' }],
      }, //新增学生窗口的校验规则
    };
  },
  created() {
    // 初始化获取列表数据
    this.fetchData();
  },

  components: {},

  methods: {
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
    // 获取数据
    fetchData() {
      // studentApi.getList().then((response) => {
      // 调用分页查询数据
      studentApi.search(this.currentPage, this.pageSize, this.searchMap).then((response) => {
        const resp = response.data;
        // this.studentList = resp.data;
        this.studentList = resp.data.rows;
        this.total = resp.data.total;
      });
    },
    // 编辑按钮，打开编辑窗口
    handleEdit(id) {
      this.handleAdd();
      studentApi.getById(id).then((response) => {
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
          studentApi.deleteById(id).then((response) => {
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
      // 必须要手动清空id值，因为pojoForm中没有id，所以resetFields不能给id赋初始。
      this.pojo.id = null;
      this.pojo.uid = null;
      this.pojo.clockinNum = 0;
      console.log('表单已初始化');
    },
    // 提交新增数据
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // TODO 提交数据
          studentApi.add(this.pojo).then((response) => {
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
    //  更新学生记录
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交更新
          studentApi.update(this.pojo).then((response) => {
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
    // 监听table中本周打卡数排序按钮的变化
    tableSortChange(column) {
      console.log(column.order);
      if (column.order === 'descending') {
        // 降序
        this.searchMap.orderBy = 'clockinNum';
        this.searchMap.order = 'desc';
      } else if (column.order === 'ascending') {
        // 升序
        this.searchMap.orderBy = 'clockinNum';
        this.searchMap.order = 'asc';
      } else {
        // 默认排序
        this.searchMap.orderBy = null;
        this.searchMap.order = null;
      }
      this.fetchData();
    },
  },
  // 在过滤器中不能引用当前实例 this，this,levelOptions是错误的，所以要放在全局
  filters: {
    levelFilter(type) {
      const levelOption = levelOptions.find((obj) => {
        return obj.type == type;
      });
      return levelOption ? levelOption.name : null;
    },
    isGraduateFilter(type) {
      const isGraduateOption = isGraduateOptions.find((obj) => {
        return obj.type == type;
      });
      return isGraduateOption ? isGraduateOption.name : null;
    },
    ageFilter(birthday) {
      // 判断生日是否为空，为空则不计算
      if (birthday != null) {
        //出生时间 毫秒
        var birthDayTime = new Date(birthday).getTime();
        //当前时间 毫秒
        var nowTime = new Date().getTime();
        //一年毫秒数(365 * 86400000 = 31536000000)
        return Math.ceil((nowTime - birthDayTime) / 31536000000);
      }
      return null;
    },
  },
};
</script>

<style scoped></style>
