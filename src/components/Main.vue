<template>
    <div>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-card :body-style="{ padding: '0px' }">
            <img src="../assets/images/Summary.png" class="Summary">
            <div style="padding: 14px;">
              <div class="bottom clearfix">
                <el-button class="button" @click="routerPush('summary')">Summary</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card :body-style="{ padding: '0px' }">
            <img src="../assets/images/Analyze.png" class="Analyze">
            <div style="padding: 14px;">
              <div class="bottom clearfix">
                <el-button class="button" @click="routerPush('analyze')">Analyze</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card :body-style="{ padding: '0px' }">
            <img src="../assets/images/Download.png" class="Download">
            <div style="padding: 14px;">
              <div class="bottom clearfix">
                <el-button class="button" @click="routerPush('download')">Download</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import router from '../router'

  export default {
    name: 'Welcome',
    methods: {
      async routerPush(path)
      {
       // console.log(path)
        await this.$router.push(path)
      }
    }
  }
</script>

<style lang="less" scoped>
.el-card{
  margin-top: 25px;
  border-radius: 4px;
  min-height: 36px;
  height: 320px;
  width: 250px;
  img{
    margin-top: 10px;
    width: 230px;
    height: 230px;
  }
}
.el-row{
  height: 100%;
  width: 100%;
  padding: 50px 50px 50px 70px;
  margin: 0px;
  text-align: center;
}
</style>
