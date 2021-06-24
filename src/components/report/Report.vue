<template>
  <div>
    <!--  面包屑导航  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图  -->
    <el-card>
      <div id="main" style="width: 100%;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
  //导入echarts
  // import echarts from 'echarts'
  let echarts = require('echarts')

  import _ from 'lodash'

  import {getBrokeLine} from '../../network/report'

  export default {
    name: "Report",
    data() {
      return {
        //需要合并的数据
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    created() {

    },
    methods: {},
    //此时页面上的元素已被渲染完毕
    mounted() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('main'))

      getBrokeLine().then(res => {
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        // 指定图表的配置项和数据
        const result = _.merge(res.data, this.options)
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
      })
    }
  }
</script>

<style scoped>

</style>