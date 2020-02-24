<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div class="header-container">
        <img src="../assets/logo.png" alt="logo.png">
        <h1>ceRNA Analyze</h1>
      </div>
    </el-header>
    <!--页面主体区域-->
    <el-container>
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
  name: 'Home'
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
  .el-main{
    /*margin: 20px 10px 10px 50px;*/
    /*width: 1050px;*/
    /*padding: 0;*/
    background: white;
    /*border: 1px solid #bbbbbb;*/
    /*border-radius: 10px;*/
  }
  .el-footer{
    text-align: center;
    font-weight: bold;
  }
  .el-menu-item, .el-submenu{
    font-weight: bold;
    margin: 10px;
    padding: 0px;
  }
  .el-submenu{

  }
  .el-card{
    width: 100%;
    height: 100%;
  }
</style>
