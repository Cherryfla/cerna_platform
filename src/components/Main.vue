<template>
    <div>
      <el-row>
        <el-col :span="12">
          <el-card class="chartCard">
            <div id="barChart" style="width: 500px;height:200px;"></div>
          </el-card>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-card class="card-panel" style="margin-left: 10px">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="Book" icon-name="card-panel-icon"></svg-icon>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card class="cardContainer">
        <div class="cardBox">
          <el-card v-for="(item, index) in featureList" :key="index"
                   :body-style="{ padding: '0px' }" class="featureCard">
            <img :src="require('../assets/images/'+item+'.png')" :class="item"
                  @click="routerPush(item.toLowerCase())" style="cursor: pointer">
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

  const animationDuration = 6000
  export default {
    name: 'Welcome',
    mounted () {
      this.$nextTick(() => {
        this.initBarChart()
      })
    },
    created () {

    },
    data() {
      return {
        barChart: null,
        featureList: ['Summary', 'Analyze', 'Download', 'History']
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
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '5%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false,
            }
          }],
          series: [{
            name: 'pageA',
            type: 'bar',
            barWidth: '60%',
            stack: 'vistors',
            data: [79, 52, 200, 334, 390, 330, 220],
            animationDuration
          }, {
            name: 'pageB',
            type: 'bar',
            barWidth: '60%',
            stack: 'vistors',
            data: [80, 52, 200, 334, 390, 330, 220],
            animationDuration
          }, {
            name: 'pageC',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [30, 52, 200, 334, 390, 330, 220],
            animationDuration
          }]
        })
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
    display: inline-block;
    margin: 10px 18px 10px;
    border-radius: 10px;
    min-height: 36px;
    height: 290px;
    width: 250px;
    img{
      margin-top: 10px;
      width: 200px;
      height: 200px;
    }
    &:hover{
      background: #f5faff;
    }
  }
  .chartCard{
    margin-top: 10px;
    border-radius: 20px;
  }


  .card-panel {
    height: 240px;
    margin-top: 10px;
    border-radius: 20px;
    &:hover {
      .icon-people {
        background: #40c9c6;
        color: #fff;
      }
    }
    .icon-people {
      color: #40c9c6;
    }
  }
  .icon-people {
    width: 110px;
    height: auto;
    font-size: 100px;
    text-align: center;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }
</style>
