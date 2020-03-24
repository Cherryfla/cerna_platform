<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Profile</el-breadcrumb-item>
    </el-breadcrumb>
    <!--注册表单区域-->
    <el-card>
      <el-form ref="profileFormRef" :model="profileForm" :rules="profileFormRules" label-position="top">
        <el-form-item  label="Username:">
          <el-input :disabled="true" v-model="profileForm.username"></el-input>
        </el-form-item>
        <el-form-item  label="Register Time:">
          <el-input :disabled="true" v-model="profileForm.register_time"></el-input>
        </el-form-item>
        <el-form-item label="Email:" prop="email">
          <el-input v-model="profileForm.email"
                    placeholder="Please input your email" disabled></el-input>
        </el-form-item>
        <el-form-item label="Old Password:" prop="oldPassword">
          <el-input type="password" v-model="profileForm.oldPassword"
                    placeholder="Please input old password"></el-input>
        </el-form-item>
        <el-form-item label="New Password:" prop="newPassword" >
          <el-input :type="passwordType" v-model="profileForm.newPassword"
                    placeholder="Please input new password">
            <i class="el-icon-view" slot="suffix" @click="handleViewPassword"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="button-box">
        <el-button type="primary" @click="updateUserInfo">Update</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Profile',
    created () {
      this.getUserInfo()
    },
    data () {
      let checkNewPassword = (rule, value, callback) => {
        //验证密码的正则表达式
        const regPassword = /^[a-z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]{8,16}|[]$/
        if (regPassword.test(value)) {
          //合法校验
          return callback()
        } else {
          return callback(new Error('Please input valid password'))
        }
      }
      let checkEmail = (rule, value, callback) => {
        //验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})|[]$/
        if (regEmail.test(value)) {
          //合法校验
          return callback()
        } else {
          return callback(new Error('Please input valid email'))
        }
      }
      return {
        profileForm: {
          username: '',
          email: '',
          register_time: '',
          newPassword: '',
          oldPassword: '',
          password: ''
        },
        profileFormRules: {
          newPassword: [
            {
              validator: checkNewPassword,
              trigger: 'blur'
            }
          ],
          email: [
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          oldPassword: [
            {
              required: true,
              message: 'please input your email',
              trigger: 'blur'
            },
          ]
        },
        passwordType: "password"
      }
    },
    methods: {
      updateUserInfo(){
        this.$refs.profileFormRef.validate(async valid => {
          if(!valid)
            return
          const res = await this.$http.post('user/userinfo', {
            password: this.profileForm.password,
            email: this.profileForm.email
          }).catch(error => {
            if (error.response) {
              return this.$message.error(error.response.data);
            }
            else {
              return this.$message.error(error.message);
            }
          })
          // console.log(res)
          if(res.status != 200)
            return this.$message.error("Sign up failed")
          this.$message.success('Update success')
          await this.$router.push('/home')
        })
      },
      async getUserInfo(){
        const res = await this.$http.get('user/userinfo').catch(error => {
          if (error.response) {
            return this.$message.error(error.response.data);
          } else {
            return this.$message.error(error.message);
          }
        })
        if(res.status !== 200)
          this.$message.error('Get user profile error')
        this.profileForm.username = res.data.username
        this.profileForm.password = res.data.password
        this.profileForm.email = res.data.email
        this.profileForm.register_time = res.data.register_time
      },
      handleViewPassword(){
        if( this.passwordType === 'password')
          this.passwordType = 'text'
        else
          this.passwordType = 'password'
      }
    }
  }
</script>

<style scoped>
  .el-card{
    margin-top: 10px;
  }
  .button-box{
    margin-top: 40px ;
    text-align: center;
  }
  .el-button{
    width: 250px;
  }
  .el-form-item{
    width: 500px !important;
  }
</style>
