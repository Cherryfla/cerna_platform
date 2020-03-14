<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>Contract</el-breadcrumb-item>
      </el-breadcrumb>
      <!--主体区域-->
      <div class="main_content">
        <h2 style="text-align: center">Contact Information</h2>
        <address>
          Chu Pan, Ph.D.<br>
          College of Computer Science and Electronic Engineering<br>
          Hunan University, China<br>
          Phone: <a class="phone" id="work" :href="phoneHref">(86) XXXX-XXX</a><br>
          Fax: <span class="phone" id="fax">(86) XXXXXX</span><br>
          E-mail: <a class="email" href="luojiawei@hnu.edu.cn">luojiawei@hnu.edu.cn</a>
          <a target="_blank" href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=dxoYGQQDEgUeDw83ERgPGhYeG1kUGBo"
             style="margin-left:10px;text-decoration:none;">
            <img src="http://rescdn.qqmail.com/zh_CN/htmledition/images/function/qm_open/ico_mailme_11.png"/>
          </a>
          <br>
          Address: <a class="map" :href="addressHref" rel="external"
                      target="_blank">NO.2 Lushan South St, ChangSha City, China, TX 410082</a><br>
        </address>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'Contract',
    created () {

    },
    methods: {
    },
    data () {
      return{
        addressHref: "https://www.amap.com/place/B02DB0ZQIR",
        phoneHref: ''
      }
    }
  }
</script>

<style scoped>

</style>
