<template>
    <div class="login">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单区域 -->
            <el-form class="formBox" :model = "loginForm" :rules="loginFormRules" ref="loginFormRef">
                <!-- 用户名 -->
                <el-form-item prop = "username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop = "password">
                    <el-input type = "password" v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>    
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
        // 这是登录表单数据绑定的对象
        loginForm: {
            username: 'admin',
            password: '123456'
        },
        // 这是表单验证规则的对象
        loginFormRules: {
            // 验证用户名
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
                // 验证密码
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }]
        }
    }
  },
  mounted () {
      
  },
  methods: {
      // 点击重置按钮  清空表单
      resetLoginForm() {
        //   console.log(this);
        this.$refs.loginFormRef.resetFields()
      },
      // 登录
      login() {
          this.$refs.loginFormRef.validate(async vaild => {
              // 当vaild  为false时阻止发送请求
              if (!vaild) return
              const {data: res} = await this.$http.post('login', this.loginForm)
              // 登录失败
              if (res.meta.status !== 200) {
                  return this.$message({
                      message: '用户名或者密码错误',
                      type: 'error',
                      showClose: true,
                      duration: 3000,
                  });
                  
              }
                // 登录成功
                this.$message({
                    message: '登录成功',
                    type: 'success',
                    showClose: true,
                    duration: 3000,
                });
                // 将token保存到sessionStorage中
                window.sessionStorage.setItem('token', res.data.token)

                // 利用编程式导航跳转到首页
                this.$router.push('/home')
          })
      }
  }
}
</script>

<style lang="less" scoped>
.login {
  position: relative;
  height: 100%;
  background: #2b4b6b;
}
.login_box {
  position: absolute;
  width: 450px;
  height: 300px;
  background-color: #fff;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-radius: 5px;
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.formBox {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns {
    display: flex;
    justify-content: flex-end;
}
</style>
