<template>
  <div>
    <!--  面包屑导航  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图  -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--   订单列表   -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="150px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="150px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="150px">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_send" @change="orderStateChanged(scope.row.order_id)" active-text="是"
                       inactive-text="否">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <!--      修改订单地址      -->
            <el-tooltip effect="dark" content="修改订单地址" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            </el-tooltip>
            <!--      物流进度      -->
            <el-tooltip effect="dark" content="物流进度" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-location" size="mini"
                         @click="showProgressBox(scope.row.user_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--   分页   -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!--  修改地址对话框  -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="40%" @close="addressDialodClosed">
      <!--   表单   -->
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="citydata" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address1">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
  </span>
    </el-dialog>
    <!--  物流信息对话框  -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="40%">
      <!--   时间线   -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time"
                          :icon="activity.icon" :type="activity.type" :color="activity.color" :size="activity.size">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
  import {getOrderList, getProgressById, orderStateChanged} from '../../network/order'

  import citydata from './citydata'

  export default {
    name: "Order",
    data() {
      return {
        //查询条件
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        //总数据条数
        total: 0,
        //订单列表
        orderList: [],
        //控制修改订单地址对话框的显示与隐藏
        addressVisible: false,
        //修改地址的表单数据
        addressForm: {
          address1: [],
          address2: ''
        },
        //表单验证规则
        addressFormRules: {
          address1: [
            {required: true, message: '请选择省市区县', trigger: 'blur'}
          ],
          address2: [
            {required: true, message: '请输入详细地址', trigger: 'blur'}
          ]
        },
        citydata,
        //控制物流进度对话框的显示与隐藏
        progressVisible: false,
        //物流测试单号
        // logistics:804909574412544580
        //物流信息
        progressInfo: [
          {
            "time": "2018-05-10 09:39:00",
            "ftime": "2018-05-10 09:39:00",
            "context": "已签收,感谢使用顺丰,期待再次为您服务",
            "location": ""
          },
          {
            "time": "2018-05-10 08:23:00",
            "ftime": "2018-05-10 08:23:00",
            "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
            "location": ""
          },
          {
            "time": "2018-05-10 07:32:00",
            "ftime": "2018-05-10 07:32:00",
            "context": "快件到达 [北京海淀育新小区营业点]",
            "location": ""
          },
          {
            "time": "2018-05-10 02:03:00",
            "ftime": "2018-05-10 02:03:00",
            "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
            "location": ""
          },
          {
            "time": "2018-05-09 23:05:00",
            "ftime": "2018-05-09 23:05:00",
            "context": "快件到达 [北京顺义集散中心]",
            "location": ""
          },
          {
            "time": "2018-05-09 21:21:00",
            "ftime": "2018-05-09 21:21:00",
            "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
            "location": ""
          },
          {
            "time": "2018-05-09 13:07:00",
            "ftime": "2018-05-09 13:07:00",
            "context": "顺丰速运 已收取快件",
            "location": ""
          },
          {
            "time": "2018-05-09 12:25:03",
            "ftime": "2018-05-09 12:25:03",
            "context": "卖家发货",
            "location": ""
          },
          {
            "time": "2018-05-09 12:22:24",
            "ftime": "2018-05-09 12:22:24",
            "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
            "location": ""
          },
          {
            "time": "2018-05-08 21:36:04",
            "ftime": "2018-05-08 21:36:04",
            "context": "商品已经下单",
            "location": ""
          }
        ],
        activities: [
          {
            content: '支持使用图标',
            timestamp: '2018-04-12 20:46',
            size: 'large',
            type: 'primary',
            icon: 'el-icon-more'
          }, {
            content: '支持自定义颜色',
            timestamp: '2018-04-03 20:46',
            color: '#0bbd87'
          }, {
            content: '支持自定义尺寸',
            timestamp: '2018-04-03 20:46',
            size: 'large'
          }
        ]
      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      getOrderList() {
        getOrderList(this.queryInfo).then(res => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // this.$message.success(res.meta.msg)
          this.total = res.data.total
          this.orderList = res.data.goods
        })
      },
      //监听pangsize
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getOrderList()
      },
      //监听pagenum
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getOrderList()
      },
      //展示修改地址的对话框
      showBox() {
        this.addressVisible = true
      },
      //监听表单关闭
      addressDialodClosed() {
        this.$refs.addressFormRef.resetFields()
      },
      showProgressBox(user_id) {
        // getProgressById(user_id).then(res=>{
        //   console.log(res)
        // })
        this.progressVisible = true
      },
      //监听Switch开关状态的改变
      orderStateChanged(order_id) {
        orderStateChanged(order_id, this.orderList[order_id]).then(res => {
          console.log(res)
        })
      }
    }
  }
</script>

<style scoped>
  @import '../../plugins/timeline/timeline.css';
  @import '../../plugins/timeline-item/timeline-item.css';

  .el-cascader {
    width: 100%;
  }
</style>