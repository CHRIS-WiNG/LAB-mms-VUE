<template>
  <div class="diary">
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
    </el-form>
    <!-- 表单 -->
    <el-table :data="clockinList" height="700" style="width: 100%" stripe border>
      <!-- type="index" 获取索引值，label显示标题 -->
      <el-table-column prop="date" label="日期" width="150" align="center"> </el-table-column>
      <el-table-column prop="time" label="时间" width="150" align="center"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="150" align="center"> </el-table-column>
      <el-table-column prop="title" label="标题" width="250" align="center"> </el-table-column>
      <el-table-column label="查看" align="center" width="150">
        <template slot-scope="scope">
          <el-button @click="handleShow(scope.row.id)" size="mini" type="primary" plain>查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" v-if="this.$store.state.user.user.permission === 1">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[20, 30, 40, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-drawer :visible.sync="drawer" :direction="direction" size="50%">
      <mavon-editor
        class="md"
        :value="pojo.content"
        :subfield="false"
        :defaultOpen="'preview'"
        :toolbarsFlag="false"
        :editable="false"
        :scrollStyle="true"
        :ishljs="true"
      ></mavon-editor>
    </el-drawer>
  </div>
</template>

<script>
import diaryApi from '@/api/diary';

export default {
  data() {
    return {
      clockinList: [],
      total: 0, // 总记录数
      currentPage: 1,
      pageSize: 20, //
      drawer: false,
      direction: 'rtl',
      searchMap: {
        name: '',
        date: ['', ''],
      }, //条件查询绑定的条件值
      pojo: {
        uid: '',
        name: '',
        date: '',
        time: '',
        content: '',
        title: '',
      }, //提交的数据
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
      diaryApi.search(this.currentPage, this.pageSize, this.searchMap).then((response) => {
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
    // 弹出新增窗口
    handleShow(id) {
      this.drawer = true;
      diaryApi.getById(id).then((response) => {
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
          diaryApi.deleteById(id).then((response) => {
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
  },
};
</script>

<style>
.el-drawer.rtl {
  overflow: scroll;
}
</style>
