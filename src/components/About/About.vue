<template>
    <div>
      <!--面包屑导航区域-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>About</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="main_content">
        <div>
          <h2>Web App Release Information</h2>
          <p>
            Version: <span class="version">{{webVersion}}</span><br>
            Date: <span class="date">{{webDate}}</span>
          </p>
        </div>
        <div>
          <h2>Data Release Information</h2>
          <p>
            Version: <span class="version">{{dataVersion}}</span><br>
            Date: <span class="date">{{dataDate}}</span>
          </p>
        </div>
        <div class="mapBox">
          <a href="https://clustrmaps.com/site/1b48n"  title="Visit tracker">
            <img width="100%" src="//www.clustrmaps.com/map_v2.png?d=0MnFwIRn42C8Udie3yqpJW9lXGc42fNIFb27xS0OBIg&cl=ffffff" />
          </a>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'About',
    created () {

    },
    methods: {
    },
    data () {
      return{
        dataVersion: "1.0",
        dataDate: "2020/1/1",
        webVersion: "1.0",
        webDate: "2020/1/1"
      }
    }
  }
</script>

<style scoped>
  .mapBox{
    width: 250px;
    height: auto;
  }
</style>
