<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>Administrator</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <!--导航菜单区域-->
        <el-menu unique-opened router :default-active='adminPage?"/admin/"+adminPage[0]:""' mode="horizontal">
          <el-menu-item v-for="item in adminPage" :key="item" :index="'/admin/' + item">
            <template slot="title">{{pageName[item]}}</template>
          </el-menu-item>
        </el-menu>
        <router-view></router-view>
      </el-card>
    </div>
</template>

<script>
  export default {
    name: 'admin',
    created () {
      this.getAdminPages().then(this.doRedirect)
    },
    data (){
      return{
        adminPage: [],
        pageName: {
          'user': '用户管理',
          'faq': '问答管理',
          'files': '文件管理',
          'analyze': '分析模块管理'
        }
      }
    },
    methods: {
      async getAdminPages(){
        const res = await this.$http.get('admin/getadminpages').catch(error => {
          if (error.response) {
            this.$message.error(error.response.data);
          }
          else {
            this.$message.error(error.message);
          }
        })
        if(res.status !== 200)
          this.$message.error('Get admin pages failed')
        if(res.data.msg === 'denied')
          await this.$router.push('/login')
        this.adminPage = res.data.list
      },
      doRedirect(){
        if(this.adminPage.length > 0) {
          this.$router.replace('/admin/' + this.adminPage[0])
        }
      }
    }
  }
</script>

<style scoped>
  .el-card{
    margin-top: 10px;
  }
  .el-menu{
    margin-bottom: 10px;
  }
</style>
