<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Sign up</el-breadcrumb-item>
    </el-breadcrumb>
    <!--注册表单区域-->
    <el-card>
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules"
               label-position="top" label-width="0px">
        <el-form-item label="Username:" prop="username">
          <el-input v-model="registerForm.username"
                    placeholder="Length between 4 and 15"></el-input>
        </el-form-item>
        <el-form-item label="Password:" prop="password" >
          <el-input type="password" v-model="registerForm.password"
                    placeholder="Length between 8 and 16"></el-input>
        </el-form-item>
        <el-form-item label="Repeat Your Password:" prop="repeatPassword">
          <el-input v-model="registerForm.repeatPassword" type="password"
                    placeholder="Please input your password again"></el-input>
        </el-form-item>
        <el-form-item label="Email:" prop="email">
          <el-input v-model="registerForm.email"
                    placeholder="Please input your email"></el-input>
        </el-form-item>
        <el-form-item label="Verification code: " prop="authCode">
          <el-row>
            <el-col :span="15">
              <el-input v-model="registerForm.authCode"
                        placeholder="Email verification code"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button style="margin-left: 10px" type="success" :disabled="buttonDisabled" @click="sendButtonClick">
                {{buttonText}}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div class="button-box">
        <el-button class="footBtn" type="primary" @click="registerFormSubmit">Submit</el-button>
        <el-button class="footBtn" type="danger" @click="resetForm">Reset</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Register',
    created () {

    },
    data () {
      let checkUsername = (rule, value, callback) => {
        //验证用户名的正则表达式
        const regUsername = /^[a-zA-Z0-9_]{4,15}$/
        if (regUsername.test(value)) {
          //合法校验
          return callback()
        } else {
          return callback(new Error('Please input valid username'))
        }
      }
      let checkPassword = (rule, value, callback) => {
        //验证密码的正则表达式
        const regPassword = /^[a-z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]{8,16}$/
        if (regPassword.test(value)) {
          //合法校验
          return callback()
        } else {
          return callback(new Error('Please input valid password'))
        }
      }
      let checkRepeatPassword = (rule, value, callback) =>{
        if(this.registerForm.password == this.registerForm.repeatPassword){
          return callback()
        }
        else{
          return callback(new Error('Please make sure the password is the same'))
        }
      }
      let checkEmail = (rule, value, callback) => {
        //验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
        if (regEmail.test(value)) {
          //合法校验
          return callback()
        } else {
          return callback(new Error('Please input valid email'))
        }
      }
      return {
        registerForm: {
          username: '',
          password: '',
          email: '',
          repeatPassword: '',
          authCode: '',
        },
        registerFormRules: {
          username: [
            {
              required: true,
              message: 'please input the username',
              trigger: 'blur'
            },
            {
              validator: checkUsername,
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: 'please input the password',
              trigger: 'blur'
            },
            {
              validator: checkPassword,
              trigger: 'blur'
            }
          ],
          repeatPassword: [
            {
              required: true,
              message: 'please repeat the password',
              trigger: 'blur'
            },
            {
              validator: checkRepeatPassword,
              trigger: 'blur'
            }
          ],
          email: [
            {
              required: true,
              message: 'please input your email',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          authCode: [
            {
              required: true,
              message: 'Please input the verification code',
              trigger: 'blur'
            }
          ]
        },
        buttonDisabled: false,
        buttonText: 'Send'
      }
    },
    methods: {
      registerFormSubmit(){
        this.$refs.registerFormRef.validate(async valid => {
          if(!valid)
            return
          const res = await this.$http.post('user/register', this.registerForm).catch(error => {
            if (error.response) {
              return this.$message.error(error.response.data);
            }
            else {
              return this.$message.error(error.message);
            }
          })
          // console.log(res)
          if(res.status != 200)
            return this.$message.error("Sign up failed");
          if(res.data.msg != 'success')
            return this.$message.error(res.data.msg)
          this.$message.success('success')
          await this.$router.push('/home')
        })
      },
      resetForm(){
        this.$refs.registerFormRef.resetFields()
      },
      sendButtonClick(){
        if (this.buttonDisabled)
          return
        this.$refs.registerFormRef.validateField("email", async validStr =>{
          // console.log(validStr)
          if(!validStr){
            const res = await this.$http.get('user/sendemailcode', {
              params: {
                'email': this.registerForm.email,
                'type': 0
              }
            }).catch(error => {
              if (error.response) {
                return this.$message.error(error.response.data);
              } else {
                return this.$message.error(error.message);
              }
            })
            if(res.status !== 200)
              return this.$message.error('Send error')
            if(res.data.msg !== 'success')
              return this.$message.error(res.data.msg)
            this.getSecond(60)
            return this.$message.success('Send success')
          }
        })
      },
      // 倒计时wait秒
      getSecond(wait){
        if(wait === 0) {
          this.buttonDisabled = false
          this.buttonText="Send"
        }
        else {
          this.buttonDisabled = true;
          this.buttonText=`wait ${wait}s`
          // console.log(wait)
          setTimeout(() => {
            this.getSecond(wait-1 );
          },
            1000);
        }
      }
    }
  }
</script>

<style scoped>
  .el-card{
    margin-top: 10px;
  }
  .button-box{
    margin-top: 35px ;
    text-align: center;
  }
  .footBtn{
    width: 250px !important;
  }
  .el-form-item{
    width: 500px !important;
  }
  .sendButton{
    height: 100% !important;
  }
</style>
