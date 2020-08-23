<template>
  <div class="login-container">
    <img class="logo-img" src="@/assets/logo_pku.png" width="45px" alt="" />
    <h1 class="login-title">GIL实验室信息系统</h1>
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="80px"
      class="login-form"
      @keyup.enter.native="submitForm('form')"
    >
      <h2 class="form-title">欢迎登陆</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
    <p class="copyright">
      copyright © <a href="https://zebin.wang" target="_blank" class="copyright-link">王泽斌</a> 2020-现在
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: 'Chris',
        password: '123456',
      },
      rules: {
        username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单给后台验证是否正确
          this.$store
            .dispatch('Login', this.form)
            .then((response) => {
              if (response.flag) {
                this.$router.push('/'); // 前往首页
                this.$message({
                  message: "登陆成功",
                  type: 'success',
                });
              } else {
                this.$message({
                  message: response.message,
                  type: 'warning',
                });
              }
            })
            .catch();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-form {
  position: absolute;
  width: 350px;
  /* 上下间隙 160px，左右自动居中 */
  margin-left: 75%;
  margin-top: 15%;
  background-color: rgb(255, 255, 255, 0.6);
  padding: 28px;
  border-radius: 20px;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('../../assets/login.jpg') no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
}
.form-title {
  color: dimgrey;
  margin-left: 28px;
  font-weight: lighter;
  text-align: left;
  font-size: 30px;
}
.logo-img {
    position: absolute;
    align-items: center;
    margin-left: 80px;
    margin-top: 65px;
}
.login-title {
  color: white;
  position: absolute;
  margin-left: 140px;
  margin-top: 60px;
  font-weight: 200;
  text-align: left;
  font-size: 40px;
}
.copyright {
  position: absolute;
  left: 47%;
  color: black;
  bottom: 3%;
  font-size: 9px;
  font-weight: 700;
}
.copyright-link {
  color: black;
}
</style>
