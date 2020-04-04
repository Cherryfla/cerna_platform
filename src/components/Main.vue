<template>
    <div>
      <el-row>
        <el-col :span="12">
          <el-card class="chartCard">
            <div id="barChart" style="width: 100%;height:200px;"></div>
          </el-card>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-card class="chartCard" style="margin-left: 10px">
            <div class="description">
              <h3><i class="el-icon-data-line"></i> Platform Features: </h3>
              <el-divider></el-divider>
              <ul>
                <li>Use built-in data for analysis</li>
                <li>View your operation history</li>
                <li>Download the data provided by us</li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card class="cardContainer">
        <div class="cardBox">
          <el-card v-for="(item, index) in featureList" :key="index"
                   :body-style="{ padding: '0px' }" class="featureCard">
            <div :class="['iconWrapper', 'div'+item]" @click="routerPush(item.toLowerCase())">
              <svg-icon :icon-class="item" icon-name="'icons"></svg-icon>
            </div>
<!--            <img :src="require('../assets/images/'+item+'.png')" :class="item"-->
<!--                  @click="routerPush(item.toLowerCase())" style="cursor: pointer">-->
            <div style="padding: 14px;">
              <div class="bottom clearfix">
                <el-button class="button" @click="routerPush(item.toLowerCase())">{{item}}</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </el-card>
    </div>
</template>

<script>
  import router from '../router'
  import echarts from 'echarts'
  require('echarts/theme/macarons')

  const animationDuration = 3000
  export default {
    name: 'Welcome',
    mounted () {
      this.getChartData().then(()=> {
        this.$nextTick(() => {
          this.initBarChart()
        })
      })
    },
    created () {
      this.getChartData()
    },
    data() {
      return {
        barChart: null,
        featureList: ['Summary', 'Analyze', 'Download', 'History'],
        chartKeys: ['Summary', 'Analyze', 'Download', 'History'],
        chartScores: []
      }
    },
    methods: {
      async routerPush(path)
      {
       // console.log(path)
        await this.$router.push(path)
      },
      initBarChart() {
        this.barChart = echarts.init(document.getElementById('barChart'), 'macarons')
        this.barChart.setOption({
          title: {
            text: "Data Tag Statistic",
            right: '0',
            top: '0',
            textStyle: {
              fontSize: '15px',
              fontWeight: 'bold'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            show: true,
            interval:0,
            data: this.chartKeys,

          },
          yAxis: {
            minInterval: 1,
            type: 'value'
          },
          axisLabel:{
            formatter: function (value, index) {
              if(value.length>10){
                return value.substr(0,5)+'...'
              }else{
                return value
              }
            }
          },
          grid: {
            top: '11%',
            left: '2%',
            right: '0%',
            bottom: '2%',
            containLabel: true
          },
          series: [{
            name: 'Page Summary',
            data: this.summaryScores,
            type: 'bar',
            stack: 'chartData',
            barWidth: '60%',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)',
            },
            itemStyle: {
              emphasis: {
                barBorderRadius: 3
              },
              normal: {
                barBorderRadius: 3
              }
            },
            animationDuration
          }, {
            name: 'Page Download',
            data: this.downloadScores,
            type: 'bar',
            stack: 'chartData',
            barWidth: '60%',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)',
            },
            itemStyle: {
              emphasis: {
                barBorderRadius: 3
              },
              normal: {
                barBorderRadius: 3
              }
            },
            animationDuration
          }]
        })
      },
      async getChartData(){
        const res = await this.$http.get('chartdata').catch(error => {
          if (error.response) {
            return this.$message.error(error.response.data);
          }
          else {
            return this.$message.error(error.message);
          }
        })
        if(res.status !== 200)
          return this.$message.error('Get chart data failed')
        res.data.keys.forEach(item => {
          String(item)
        })
        // console.log(res)
        this.chartKeys = res.data.keys
        this.summaryScores = res.data.summary
        this.downloadScores = res.data.download
      }
    },
  }
</script>

<style lang="less" scoped>
  .cardContainer{
    margin-top: 10px;
    width: auto;
    height: auto;
    min-width: 1200px;
    text-align: center;
    border-radius: 20px;
    padding: 0px;
  }
  .cardBox{
    margin: 0px;
    padding: 0px;
  }
  .featureCard{
    position: relative;
    display: inline-block;
    margin: 10px 18px 10px;
    border-radius: 10px;
    min-height: 36px;
    height: 290px;
    width: 250px;
    text-align: center;
    .iconWrapper{
      margin: 30px 45px 20px 45px;
      cursor: pointer;
      font-size: 150px;
      transition: all 0.38s ease-out;
      border-radius: 10px;
      height: 165px;
      width: 165px;
      line-height: 150px;
      display: block;
    }
    .divSummary{
      color: #afa1db;
    }
    .divAnalyze{
      color: #36a3f7;
    }
    .divDownload{
      color: #f4516c;
    }
    .divHistory{
      color: #34bfa3;
    }
    .icons{
      float: left;
    }
    &:hover{
      .iconWrapper{
        color: #fff
      }
      .divSummary{
        background: #afa1db;
      }
      .divAnalyze{
        background: #36a3f7;
      }
      .divDownload{
        background: #f4516c;
      }
      .divHistory{
        background: #34bfa3;
      }
    }
  }
  .chartCard{
    margin-top: 10px;
    border-radius: 20px;
    height: 240px;
    min-width: 550px;
  }
  .description{
    margin-left: 30px;

    h3{
      color: #111111;
    }
    li{
      color: #999;
      width: 280px;
      border-radius: 5px;
      padding-left: 5px;
      &:hover{
        background: #efefef;
      }
    }
  }
</style>
