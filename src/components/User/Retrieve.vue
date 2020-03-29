<template>
    <div>
      <el-card>
        <!--步骤条-->
        <el-steps :space="350" :active="activeIndex - '0'" finish-status="success" align-center>
          <el-step title="verify email"></el-step>
          <el-step title="change password"></el-step>
          <el-step title="finish"></el-step>
        </el-steps>
        <!--验证邮箱页面-->
        <el-tabs style="margin-top: 20px;" v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave">
          <el-tab-pane label="Verify email" name="0">
            <el-form ref="emailFormRef" :model="emailForm" :rules="emailFormRules" label-position="top">
              <el-form-item label="Email:" prop="email">
                <el-row>
                  <el-col :span="10">
                    <el-input v-model="emailForm.email"
                              placeholder="Please input your email"></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="Verification code: " prop="authCode">
                <el-row>
                  <el-col :span="7">
                    <el-input v-model="emailForm.authCode"
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
              <el-button type="primary" @click="emailFormSubmit">Submit</el-button>
              <el-button type="danger" @click="resetEmailForm">Reset</el-button>
            </div>
          </el-tab-pane>
          <!--修改密码页面-->
          <el-tab-pane label="Change password" name="1">
            <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordFormRules" label-position="top">
              <el-row>
                <el-col :span="10">
                  <el-form-item label="Password:" prop="password" >
                    <el-input type="password" v-model="passwordForm.password"
                              placeholder="Length between 8 and 16"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="Repeat Your Password:" prop="repeatPassword">
                    <el-input v-model="passwordForm.repeatPassword" type="password"
                              placeholder="Please input your password again"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item>
                <div class="button-box">
                  <el-button type="primary" @click="updatePassword">Submit</el-button>
                  <el-button type="danger" @click="resetPasswordForm">Reset</el-button>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="Finish" name="2">
            <div class="successText">
              <i class="el-icon-success"></i>
              Update Password Success
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
</template>

<script>
  export default {
    name: 'Retrieve',
    created () {

    },
    data (){
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
        if(this.passwordForm.password == this.passwordForm.repeatPassword){
          return callback()
        }
        else{
          return callback(new Error('Please make sure the password is the same'))
        }
      }
      return {
        activeIndex: '0',
        operationStatus: 0,
        emailForm: {
          email: '',
          authCode: ''
        },
        emailFormRules: {
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
        passwordForm: {
          token: '',
          password: '',
          repeatPassword: ''
        },
        passwordFormRules: {
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
          ]
        },
        buttonDisabled: false,
        buttonText: 'Send'
      }
    },
    methods: {
      beforeTabLeave(activeName, oldActiveName){
        // return true
        if(activeName > this.operationStatus){
          return false
        }
      },
      sendButtonClick(){
        if (this.buttonDisabled)
          return
        this.$refs.emailFormRef.validateField("email", async validStr =>{
          // console.log(validStr)
          if(!validStr){
            const res = await this.$http.get('user/sendemailcode', {
              params: {
                'email': this.emailForm.email,
                'type': 1
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
            this.countDown(60)
            return this.$message.success('Send success')
          }
        })
      },
      countDown(wait){
        if(wait === 0) {
          this.buttonDisabled = false
          this.buttonText="Send"
        }
        else {
          this.buttonDisabled = true;
          this.buttonText=`wait ${wait}s`
          // console.log(wait)
          setTimeout(() => {
              this.countDown(wait-1 );
            },
            1000);
        }
      },
      resetEmailForm(){
        this.$refs.emailFormRef.resetFields()
      },
      emailFormSubmit(){
        this.$refs.emailFormRef.validate(async valid => {
          if(!valid)
            return
          const res = await this.$http.post('user/emailverify', this.emailForm).catch(error => {
            if (error.response) {
              return this.$message.error(error.response.data);
            }
            else {
              return this.$message.error(error.message);
            }
          })
          if(res.status !== 200)
            return this.$message.error("Failed to verify email")
          if(res.data.msg != 'success')
            return this.$message.error(res.data.msg)
          this.passwordForm.token = res.data.token
          this.operationStatus = 1
          this.activeIndex = '1'
        })
      },
      resetPasswordForm(){
        this.$refs.passwordFormRef.resetFields()
      },
      updatePassword(){
        this.$refs.passwordFormRef.validate(async valid => {
          if(!valid)
            return
          const res = await this.$http.post('user/updatepassword', this.passwordForm).catch(error => {
            if (error.response) {
              return this.$message.error(error.response.data);
            } else {
              return this.$message.error(error.message);
            }
          })
          if(res.status !== 200)
            return this.$message.error('Update password error')
          if(res.data.msg != 'success')
            return this.$message.error(this.data.msg)
          this.operationStatus = 2
          this.activeIndex = '2'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-card{
    height: 500px;
  }
  .button-box{
    width: 100%;
    margin-top: 45px ;
    text-align: center;

    .el-button{
      width: 250px;
    }
  }
  .el-form{
    margin-left: 20px;
    width: 100%;
  }
  .el-tab-pane{
    float: inherit;
  }
  .successText{
    text-align: center;
    margin-top: 30px;
    font-size: 20px;
  }
</style>
