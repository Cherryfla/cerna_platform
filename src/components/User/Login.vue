<template>
  <div>
    <el-card >
      <div class="loginBox">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px">
          <el-form-item class="inlineItem">
            <h2>Welcome Back</h2>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="username">
            <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-form-item class="inlineItem">
            <el-button type="primary" @click="handleLogin">Login</el-button>
            <el-button type="info" @click="resetLoginForm">Reset</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    created () {

    },
    data () {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginFormRules: {
          username: [
            {
              required: true,
              message: 'please input your username',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: 'please input the password',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      async handleLogin(){
        const res = await this.$http.post('user/login', this.loginForm).catch(error => {
          if (error.response) {
            return this.$message.error(error.response.data);
          }
          else {
            return this.$message.error(error.message);
          }
        })
        if(res.status !== 200)
          this.$message.error('login failed')
        console.log(res)
        if(res.data.msg !== 'success')
          this.$message.error(res.data.msg)
        this.$message.success('Login success')
        // 保存token
        const token = res.data.token
        window.sessionStorage.setItem('token', token)
        await this.$router.push('/home')
      },
      resetLoginForm(){
        this.$refs.loginFormRef.resetFields()
      }
    }
  }
</script>

<style scoped>
  .el-card{
    position: relative;
    height: 450px;
  }
  .loginBox{
    width: 300px;
    margin: 0px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
  }
  .inlineItem{
    display: inline;
    text-align: center;
  }
</style>
