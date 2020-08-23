<template>
  <div class="header">
    <a href="#/">
      <img class="logo" src="@/assets/logo_pku.png" width="30px" alt="" />
      <span class="company">GIL实验室信息系统</span>
    </a>

    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">{{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="e" icon="el-icon-edit" v-if="this.$store.state.user.user.identity === 1">每日打卡</el-dropdown-item>
        <el-dropdown-item command="c" icon="el-icon-edit-outline" v-if="this.$store.state.user.user.identity === 1">提交日报</el-dropdown-item>
        <el-dropdown-item command="d" icon="el-icon-edit">修改信息</el-dropdown-item>
        <el-dropdown-item command="a" icon="el-icon-user">修改密码</el-dropdown-item>
        <el-dropdown-item command="b" icon="el-icon-circle-close">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 修改密码表单 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="旧密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 提交日报表单 -->
    <el-dialog title="提交日报" :visible.sync="dialogDiaryVisiable" fullscreen>
      <mavon-editor id="mavonEditor" v-model="diaryForm.content" ref="md" @imgAdd="imgAdd" @imgDel="imgDel"/>
      <div slot="footer" class="button">
        <el-button @click="dialogDiaryVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitDiary(diaryForm)">提 交</el-button>
      </div>
    </el-dialog>

    <!-- 打卡表单 -->
    <el-dialog title="今日打卡" :visible.sync="dialogClockInVisible" width="350px">
      <el-form
        ref="clockinForm"
        label-width="80px"
        label-position="right"
        style="width:250px"
        :rules="rules"
        :model="clockinForm"
      >
        <!-- prop: 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的	 -->
        <el-form-item label="心情" prop="emotionType">
          <el-select v-model="clockinForm.emotionType" clearable placeholder="请选择今日心情" style="width:100%">
            <el-option
              v-for="option in emotionTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="3" v-model="clockinForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClockInVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('clockinForm')">确 定</el-button> -->
        <el-button type="primary" @click="submitClockin('clockinForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改信息" :visible.sync="dialogInfoFormVisible" width="500px">
      <el-form
        ref="infoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
        :rules="rules"
        :model="infoForm"
      >
        <!-- prop: 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的	 -->
        <el-form-item label="学号" prop="stuNum" v-if="this.$store.state.user.user.identity === 1">
          <el-input v-model="infoForm.stuNum" clearable></el-input>
        </el-form-item>
        <el-form-item label="教工号" prop="tchNum" v-if="this.$store.state.user.user.identity === 2">
          <el-input v-model="infoForm.tchNum" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="infoForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="infoForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="infoForm.mobile" clearable></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday" v-if="this.$store.state.user.user.identity === 1">
          <el-date-picker
            v-model="infoForm.birthday"
            type="date"
            placeholder="选择生日"
            value-format="yyyy-MM-dd"
            style="width:100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="院系" prop="college" v-if="this.$store.state.user.user.identity === 1">
          <el-input v-model="infoForm.college" style="width:100%" clearable></el-input>
        </el-form-item>
        <el-form-item label="学历" prop="level" v-if="this.$store.state.user.user.identity === 1">
          <el-select v-model="infoForm.level" clearable placeholder="请选择学历" style="width:100%">
            <el-option
              v-for="option in stulevelOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入学年份" prop="entryYear" v-if="this.$store.state.user.user.identity === 1">
          <el-select v-model="infoForm.entryYear" clearable placeholder="请选择入学年份" style="width:100%">
            <el-option
              v-for="option in entryYearOptions"
              :key="option.value"
              :label="option.value"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否毕业" prop="isGraduate" v-if="this.$store.state.user.user.identity === 1">
          <el-select v-model="infoForm.isGraduate" clearable placeholder="请选择" style="width:100%">
            <el-option
              v-for="option in isGraduateOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学生住址" prop="address" v-if="this.$store.state.user.user.identity === 1">
          <el-input type="textarea" v-model="infoForm.address" clearable></el-input>
        </el-form-item>
        <el-form-item label="办公室" prop="office" v-if="this.$store.state.user.user.identity === 2">
          <el-input v-model="infoForm.office" clearable></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="level" v-if="this.$store.state.user.user.identity === 2">
          <el-select v-model="infoForm.level" clearable placeholder="请选择职称">
            <el-option
              v-for="option in tchlevelOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('infoForm')">确 定</el-button> -->
        <el-button type="primary" @click="updateInfo('infoForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import passwordApi from '@/api/password';
import diaryApi from '@/api/diary';
import clockinApi from '@/api/clockin';
import studentApi from '@/api/student';
import teacherApi from '@/api/teacher';
import { mavonEditor } from 'mavon-editor';

// 心情类型
const emotionTypeOptions = [
  { type: 1, name: '😎' },
  { type: 2, name: '😄' },
  { type: 3, name: '😒' },
  { type: 4, name: '😢' },
];

// 职级类型
const tchlevelOptions = [
  { type: 1, name: '讲师' },
  { type: 2, name: '研究员' },
  { type: 3, name: '副教授' },
  { type: 4, name: '教授' },
];

// 学历类型
const stulevelOptions = [
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
    // 在 return 上面进行声明自定义校验，不能使用逗号
    // 校验旧密码是否正确
    var validateOldPass = (rule, value, callback) => {
      passwordApi.checkPwd(this.user.id, value).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          callback(); // 验证通过
        } else {
          callback(new Error(resp.message));
        }
      });
    };
    // 校验新密码是否一致
    var validatePass = (rule, value, callback) => {
      if (value != this.ruleForm.pass) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };

    return {
      // user: JSON.parse(localStorage.getItem('wzb-msm-user')),
      user: this.$store.state.user.user,
      emotionTypeOptions, // emotionTypeOptions: emotionTypeOptions
      stulevelOptions,
      tchlevelOptions,
      entryYearOptions,
      isGraduateOptions,
      dialogFormVisible: false,
      dialogDiaryVisiable: false,
      dialogClockInVisible: false,
      dialogInfoFormVisible: false,
      ruleForm: {
        oldPass: '',
        pass: '',
        checkPass: '',
      },
      rules: {
        oldPass: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { validator: validateOldPass, trigger: 'blur' },
        ],
        pass: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
        checkPass: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'change' },
        ],
        emotionType: [{ required: true, message: '心情不能为空', trigger: 'bulr' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        tchNum: [{ required: true, message: '教工号不能为空', trigger: 'blur' }],
        stuNum: [{ required: true, message: '学号不能为空', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
      },
      diaryForm: {
        uid: '',
        name: '',
        date: '',
        time: '',
        title: '',
        content: '',
      },
      clockinForm: {
        uid: '',
        name: '',
        date: '',
        time: '',
        emotionType: '',
        remark: '',
      }, //提交的数据
      infoForm: {
        stuNum: '',
        tchNum: '',
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
        teamName: '',
        office: '',
        teamId: null,
        uid: null, // 账户id，重要
      }, //提交的数据
    };
  },

  components: {},

  methods: {
    handleCommand(command) {
      // this.$message('点击了 ' + command);
      switch (command) {
        case 'a':
          // 修改密码
          this.handlePwd();
          break;
        case 'b':
          // 退出系统
          this.handleLogout();
          break;
        case 'c':
          // 每日日报
          this.handleDiary();
          break;
        case 'd':
          // 修改信息
          this.handleInfo();
          break;
        case 'e':
          // 打卡
          this.handleClockin();
          break;
        default:
          break;
      }
    },
    // 今天日报
    handleDiary() {
      this.dialogDiaryVisiable = true;
    },
    //  退出系统
    handleLogout() {
      this.$store.dispatch('Logout').then((response) => {
        if (response.flag) {
          // 退出成功
          this.$router.push('/login');
        } else {
          this.$message({
            message: response.message,
            type: 'warning',
            duration: 500,
          });
        }
      });
    },
    // 打开修改密码窗口
    handlePwd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.resetForm('ruleForm');
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      // 校验器校验成功后会传到这
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 校验成功
          passwordApi.updatePwd(this.user.id, this.ruleForm.checkPass).then((response) => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? 'success' : 'warning',
            });
            if (resp.flag) {
              // 更新成功，退出系统重新登录
              this.handleLogout();
              // 关闭窗口
              this.dialogFormVisible = false;
            }
          });
        } else {
          // 校验失败
        }
      });
    },
    // 绑定@imgAdd event
    imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append('file', $file);
      diaryApi.uploadFile(formdata).then((response) => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        // $vm.$img2Url 详情见本页末尾
        const resp = response.data;
        this.$message({
          message: resp.message,
          type: resp.flag ? 'success' : 'warning',
        });
        if (resp.flag) {
          var url = resp.data;
          this.$refs.md.$img2Url(pos, url);
        } else {
        }
      });
    },
    imgDel(pos) {
      var formdata = new FormData();
    },
    submitDiary(diaryForm) {
      // 判断内容是否为空
      if (diaryForm.content.trim() != '') {
        // 数据预处理
        var datetime = new Date();
        var date_now = datetime.toLocaleDateString('chinese', { hour12: false });
        this.diaryForm.date = date_now.split('/').join('-');
        this.diaryForm.time = datetime.toLocaleTimeString('chinese', { hour12: false }); // 获取24小时格式时间
        var user = this.$store.state.user.user;
        this.diaryForm.uid = user.id;
        this.diaryForm.name = user.name;
        this.diaryForm.title = `${this.diaryForm.date}__${user.name}__今日日报`;
        diaryApi.submitDiary(this.diaryForm).then((response) => {
          const resp = response.data;
          this.$message({
            message: resp.message,
            type: resp.flag ? 'success' : 'warning',
          });
          if (resp.flag) {
            this.dialogDiaryVisiable = false;
            this.diaryForm.content = '';
          }
        });
      } else {
        this.$message({
          message: '内容不能为空',
          type: 'warning',
        });
      }
    },
    // 弹出新增窗口
    handleClockin() {
      this.dialogClockInVisible = true;
      // this.$nextTick(() 是异步事件
      // 弹出窗口打开后需要加载Dom，就需要花费一点时间
      // 我们就应该等待它加载完成后，在进行调用resetFields方法，充值表单和清除样式
      // this.$nextTick(()，能够让Dom先渲染完毕，再执行回调函数
      this.$nextTick(() => {
        this.resetForm('clockinForm'); // 复用代码
      });
    },
    // 提交打卡
    submitClockin(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var datetime = new Date();
          var date_now = datetime.toLocaleDateString('chinese', { hour12: false });
          this.clockinForm.date = date_now.split('/').join('-');
          this.clockinForm.time = datetime.toLocaleTimeString('chinese', { hour12: false }); // 获取24小时格式时间
          this.clockinForm.uid = this.$store.state.user.user.id;
          this.clockinForm.name = this.$store.state.user.user.name;

          // TODO 提交数据
          clockinApi.add(this.clockinForm).then((response) => {
            const resp = response.data;
            // 新增成功
            if (resp.flag) {
              // 弹出验证成功
              this.$message({
                message: '打卡成功',
                type: 'success',
              });
              // 关闭窗口
              this.dialogClockInVisible = false;
            } else {
              // 新增失败
            }
          });
        } else {
          return;
        }
      });
    },
    // 修改信息窗口
    handleInfo() {
      this.dialogInfoFormVisible = true;
      // this.$nextTick(() 是异步事件
      // 弹出窗口打开后需要加载Dom，就需要花费一点时间
      // 我们就应该等待它加载完成后，在进行调用resetFields方法，充值表单和清除样式
      // this.$nextTick(()，能够让Dom先渲染完毕，再执行回调函数
      this.$nextTick(() => {
        this.resetForm('infoForm'); // 复用代码
      });
      var api = null;
      if (this.$store.state.user.user.identity == 1) {
        api = studentApi;
      } else {
        api = teacherApi;
      }
      var id = this.$store.state.user.user.id;
      api.getByUId(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          // 成功获取要编辑的数据到弹窗
          this.infoForm = resp.data;
        }
      });
    },
    //  更新学生记录
    updateInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var api = null;
          if (this.$store.state.user.user.identity == 1) {
            api = studentApi;
          } else {
            api = teacherApi;
          }
          // 提交更新
          api.update(this.infoForm).then((response) => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? 'success' : 'warning',
            });
            if (resp.flag) {
              this.dialogInfoFormVisible = false;
            } else {
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.logo {
  vertical-align: middle;
  padding: 0px 10px 0px 40px; /* 上 右 下 左 */
}
.company {
  position: absolute;
  color: white;
}
/* 下拉菜单 */
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  color: white;
  /* 手 */
  cursor: pointer;
}
.button {
  position: absolute;
  margin-left: 0%;
}
#mavonEditor {
  min-height: 600px;
}
</style>
