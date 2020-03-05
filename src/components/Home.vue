<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div class="header-container">
        <img src="../assets/logo.png" alt="logo.png">
        <h1>ceRNA Analyze</h1>
      </div>
      <div class="buttonBox">
        <div v-if="isLogin==false">
          <el-button type="success" size="mini" @click="handleLogin">Log in</el-button>
          <el-button type="primary" size="mini" @click="handleRegister">Sign up</el-button>
        </div>
        <div v-else>
          <el-button type="primary" size="mini" @click="handleProfile">Profile</el-button>
          <el-button type="info" size="mini" @click="handleLogout">Logout</el-button>
        </div>
      </div>
    </el-header>
    <!--页面主体区域-->
    <el-container class="main-container">
      <!--侧边栏-->
      <el-aside width="200px">
        <el-menu background-color="white" text-color="#333333" active-text-color="#111111" router>
          <el-menu-item index="home">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span>Home</span>
            </template>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span>Feature</span>
            </template>
            <el-menu-item index="summary">Summary</el-menu-item>
            <el-menu-item index="analyze">Analyze</el-menu-item>
            <el-menu-item index="download">Download</el-menu-item>
          </el-submenu>
          <el-menu-item index="about">
            <template slot="title">
              <i class="el-icon-info"></i>
              <span>About</span>
            </template>
          </el-menu-item>
          <el-menu-item index="faq">
            <template slot="title">
              <i class="el-icon-question"></i>
              <span>FAQ</span>
            </template>
          </el-menu-item>
          <el-menu-item index="contract">
            <template slot="title">
              <i class="el-icon-phone"></i>
              <span>Contract</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <!--右侧主体区域-->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!--页脚区域-->
        <el-footer>This website is for educational and research purposes only.</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  created () {
    this.judgeIfLogin()
  },
  data () {
    return{
      isLogin: false
    }
  },
  methods: {
    async judgeIfLogin(){
      const res = await this.$http.get('islogin').catch(error => {
        if (error.response) {
          return this.$message.error(error.response.data);
        }
        else {
          return this.$message.error(error.message);
        }
      })
      this.isLogin = res.data.isLogin
    },
    async handleLogin() {
      await this.$router.push('/login')
    },
    async handleRegister() {
      await this.$router.push('/register')
    },
    handleProfile(){

    },
    handleLogout(){

    }
  }
}
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background: url("../assets/images/head-background.jpeg") no-repeat;
    background-size: cover;
    //background: linear-gradient(to bottom, #303133, 83%, black);
    height: 200px !important;
    display: flex;
    justify-content: space-between;
    padding: 0px;
    text-align: center;
    color: #ffffff;
    position: relative;
  }
  .header-container{
    margin: 0 auto;
    display: flex;
    align-items: center;
    h1{
      font-size: 65px;
      margin-left: 15px;
      font-weight: bold;
    //  text-shadow: 5px 2px 6px #bbbbbb;
      font-family: Hanzipen SC;
    }
  }
  .el-aside{
    background: white;
  }
  .el-main {
    /*margin: 20px 10px 10px 50px*/
    width: 100%;
    /*padding: 0;*/

    //position:absolute;
    /*border: 1px solid #bbbbbb;*/
    /*border-radius: 10px;*/
  }
  .el-footer{
    text-align: center;
    font-weight: bold;
  }
  .el-menu-item{
    font-weight: bold;
    margin-left: 10px;
    margin-top: 10px;
  }
  .el-submenu{
    font-weight: bold;
    margin-left: 10px;
    margin-top: 10px;
    .el-menu-item{
      max-width: 150px !important;
      padding: 0px;
      min-width: 100px;
    }
  }
  .el-card{
    width: 100%;
    height: 100%;
  }
  .el-menu{
    border-right: solid 1px #e6e6e6 !important;
  }
  .buttonBox{
    position: absolute;
    height: 30px;
    right: 0;
    bottom: 0;
    margin-right: 10px;
    margin-bottom: 5px;
  }
</style>
