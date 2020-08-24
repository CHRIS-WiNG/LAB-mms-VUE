<template>
  <!-- prop: 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的	 -->
  <div class="clockin">
    <!-- 搜索框 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline" style="margin-top:20px">
      <!-- inline：一行显示 -->
      <!-- 重置表单看 el-form-item 组件元素的prop上是否指定了字段名，指定了重置才会生效 -->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名" style="width:200px" clearable></el-input>
      </el-form-item>
      <el-form-item prop="date">
        <el-date-picker
          v-model="searchMap.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="width:250px"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="fetchData()" icon="el-icon-search" circle type="primary"></el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('searchForm')" icon="el-icon-refresh-left" circle=""></el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd()" v-if="this.$store.state.user.user.identity === 1"
          >打卡</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表单 -->
    <el-table :data="clockinList" height="700" style="width: 100%" stripe border>
      <!-- type="index" 获取索引值，label显示标题 -->
      <el-table-column prop="date" label="日期" width="200" align="center"> </el-table-column>
      <el-table-column prop="time" label="时间" width="200" align="center"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="200" align="center"> </el-table-column>
      <el-table-column prop="emotionType" label="心情" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.emotionType | emotionTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
    </el-table>
    <!-- 页码 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[15, 30, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 弹出新增窗口 -->
    <el-dialog title="今日打卡" :visible.sync="dialogFormVisible" width="350px">
      <el-form
        ref="pojoForm"
        label-width="80px"
        label-position="right"
        style="width:250px"
        :rules="rules"
        :model="pojo"
      >
        <!-- prop: 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的	 -->
        <el-form-item label="心情" prop="emotionType">
          <el-select v-model="pojo.emotionType" clearable placeholder="请选择今日心情" style="width:100%">
            <el-option
              v-for="option in emotionTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="3" v-model="pojo.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button type="primary" @click="addData('pojoForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import clockinApi from '@/api/clockin';

// 心情类型
const emotionTypeOptions = [
  { type: 1, name: '😎' },
  { type: 2, name: '😄' },
  { type: 3, name: '😒' },
  { type: 4, name: '😢' },
];

export default {
  data() {
    return {
      clockinList: [],
      total: 0, // 总记录数
      currentPage: 1,
      pageSize: 15, //
      searchMap: {
        name: '',
        date: [],
      }, //条件查询绑定的条件值
      // 不要忘记将 emotionTypeOptions 绑定到data中
      emotionTypeOptions, // emotionTypeOptions: emotionTypeOptions
      dialogFormVisible: false, //控制新增对话框
      pojo: {
        uid: '',
        name: '',
        date: '',
        time: '',
        emotionType: '',
        remark: '',
      }, //提交的数据
      rules: {
        emotionType: [{ required: true, message: '心情不能为空', trigger: 'bulr' }],
      },
      // 日期选择器禁用今天之后的时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        },
      },
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
      // 调用分页查询数据
      clockinApi.search(this.currentPage, this.pageSize, this.searchMap).then((response) => {
        const resp = response.data;
        this.clockinList = resp.data.rows;
        this.total = resp.data.total;
      });
    },

    // 重置表单
    resetForm(formName) {
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      // 重置会看 el-form-item 组件元素的prop上是否指定了字段名，指定了重置才会生效
      this.$refs[formName].resetFields();
      console.log('表单已初始化');
    },
    // 提交新增数据
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 向 pojo 填入数据
          var datetime = new Date();
          var date_now = datetime.toLocaleDateString('chinese', { hour12: false });
          this.pojo.date = date_now.split('/').join('-');
          this.pojo.time = datetime.toLocaleTimeString('chinese', { hour12: false }); // 获取24小时格式时间
          this.pojo.uid = this.$store.state.user.user.id;
          this.pojo.name = this.$store.state.user.user.name;

          // TODO 提交数据
          clockinApi.add(this.pojo).then((response) => {
            const resp = response.data;
            // 新增成功
            if (resp.flag) {
              // 弹出验证成功
              this.$message({
                message: '打卡成功',
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
  },
  // 在过滤器中不能引用当前实例 this，this,emotionTypeOptions是错误的，所以要放在全局
  filters: {
    emotionTypeFilter(type) {
      const emotionTypeOption = emotionTypeOptions.find((obj) => {
        return obj.type == type;
      });
      return emotionTypeOption ? emotionTypeOption.name : null;
    },
  },
};
</script>

<style scoped></style>
