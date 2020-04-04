<template>
  <div>
    <el-card >
      <div class="loginBox">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px">
          <el-form-item class="inlineItem">
            <h2>Welcome Back</h2>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user"
                      placeholder="Username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"
                      placeholder="Password"></el-input>
          </el-form-item>
          <el-form-item prop="captcha">
            <el-row>
              <el-col :span="12">
                <el-input v-model="loginForm.captcha" prefix-icon="el-icon-location-outline"
                          placeholder="Captcha"></el-input>
              </el-col>
              <el-col :span="12">
                <img style="width: 100%;" :src="imgUrl" alt="captcha" @click="updateCode">
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item size="mini" style=" text-align: right;">
            <span @click="goRetrieve" class="forgotPassword">Forgot Password?</span>
          </el-form-item>
          <el-form-item class="inlineItem">
            <el-row>
              <el-col :span="11">
                <el-button type="primary" @click="handleLogin">Login</el-button>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-button type="info" @click="resetLoginForm">Reset</el-button>
              </el-col>
            </el-row>
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
      this.loginForm.uuid = this.getUuid()
      this.updateCode()
      // console.log(this.imgUrl)
    },
    data () {
      return {
        //控制验证码对话框显示与否
        captchaDialogVisible: false,
        //账号密码输错的次数
        countError: 0,
        url: '',
        imgUrl: '',
        loginForm: {
          username: '',
          password: '',
          captcha: '',
          uuid: ''
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
          ],
          captcha: [
            {
              required: true,
              message: 'please input the captcha',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      handleLogin(){
        this.$refs.loginFormRef.validate(async valid => {
          if(!valid)
              return
          const res = await this.$http.post('user/login', this.loginForm).catch(error => {
            if (error.response) {
              return this.$message.error(error.response.data);
            }
            else {
              return this.$message.error(error.message);
            }
          })
          if(res.status !== 200)
            return this.$message.error('login failed')
          // console.log(res)
          if(res.data.msg !== 'success') {
            this.updateCode()
            return this.$message.error(res.data.msg)
          }
          this.$message.success('Login success')
          // 保存token
          const token = res.data.token
          window.sessionStorage.setItem('token', token)
          this.$emit('changeIsLogin')
          await this.$router.push('/home')
        })
      },
      resetLoginForm(){
        this.$refs.loginFormRef.resetFields()
      },
      transform(buffer){
        let res = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          res += String.fromCharCode(bytes[i]);
        }
        return res
      },
      updateCode() {
        this.$http.get(`captcha/${this.loginForm.uuid}`, { responseType: 'arraybuffer' }).then((res) =>
        {
          let str = this.transform(res.data)
          this.imgUrl = 'data:image/jpg;base64,' + str
        });
      },
      goRetrieve(){
        this.$router.push('retrieve')
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-card{
    position: relative;
    height: 500px;
  }
  .loginBox{
    width: 300px;
    margin: 0px;
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
  }
  .inlineItem{
    display: inline;
    text-align: center;
    .el-button{
      width: 100%;
    }
  }
  .forgotPassword{
    font-size: 10px;
    cursor: pointer;
  }
</style>
