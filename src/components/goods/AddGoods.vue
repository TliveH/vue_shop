<template>
  <div>
    <!--  面包屑导航  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图  -->
    <el-card>
      <!--   提示   -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
      </el-alert>
      <!--   步骤条   -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--   tab栏   -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader expand-trigger="hover" v-model="addForm.goods_cat" :options="cateList" :props="cateProps"
                           @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--  渲染表单的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableDate" :key="item.attr_id">
              <!--  复选框组  -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(cb,i) in item.attr_vals" :key="i" :label="cb" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableDate" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--   图片上传  -->
            <!-- action表示图片上传地址 -->
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                       list-type="picture" :headers="headersObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--   富文本编辑器  -->
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <!--  添加按钮 -->
            <el-button type="primary" class="btnAdd" @click="addProduct">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!--  图片预览  -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="40%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
  import {getCateList} from '../../network/cate'
  import {getParamsList} from '../../network/params'
  import {addProduct} from '../../network/goods'

  import _ from 'lodash'

  export default {
    name: "AddGoods",
    data() {
      return {
        queryInfo: {
          query: '',
          //当前页数
          pagenum: 1,
          //当前每页显示数据
          pagesize: 5
        },
        activeIndex: '0',
        //添加商品的表单验证对象
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          goods_cat: [],
          //图片的数组
          pics: [],
          //商品的详情描述
          goods_introduce: '',
          attrs: []
        },
        //表单的验证规则
        addFormRules: {
          goods_name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          goods_price: [
            {required: true, message: '请输入商品价格', trigger: 'blur'}
          ],
          goods_weight: [
            {required: true, message: '请输入商品重量', trigger: 'blur'}
          ],
          goods_number: [
            {required: true, message: '请输入商品数量', trigger: 'blur'}
          ],
          goods_cat: [
            {required: true, message: '请选择商品分类', trigger: 'blur'}
          ]
        },
        //商品分类列表
        cateList: [],
        cateProps: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        //被激活的页签名称
        activeName: {
          many: 'many',
          only: 'only'
        },
        //动态参数列表数据
        manyTableDate: [],
        //静态属性列表数据
        onlyTableDate: [],
        //上传图片的URL地址
        uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
        //图片上传的headers请求头对象
        headersObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        previewPath: '',
        //控制图片预览框的显示与隐藏
        previewVisible: false
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      getCateList() {
        getCateList(this.queryInfo).then(res => {
          // console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.cateList = res.data.result
        })
      },
      //级联选择器选中项变化触发
      handleChange() {
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = []
        }
      },
      beforeTabLeave(activeName, oldActiveName) {
        if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          this.$message.error('请先选择商品分类')
          return false
        }
      },
      tabClicked() {
        if (this.activeIndex === '1') {
          getParamsList(this.cateId, this.activeName.many).then(res => {
            // console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }
            res.data.forEach(item => {
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
            })
            this.manyTableDate = res.data
          })
        } else if (this.activeIndex === '2') {
          getParamsList(this.cateId, this.activeName.only).then(res => {
            // console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }
            this.onlyTableDate = res.data
          })
        }
      },
      //处理图片预览效果
      handlePreview(file) {
        this.previewPath = file.response.data.url
        this.previewVisible = true
      },
      //处理移除图片的操作
      handleRemove(file) {
        //获取将要删除图片的临时路径
        const filePath = file.response.data.tmp_path
        //从pics数组中找到这个图片对应的索引值
        const i = this.addForm.pics.findIndex(x => x.pic === filePath)
        //调用splice数组的方法把图片信息对象从pics数组中移除
        thiss.addForm.pics.splice(i, 1)
      },
      //监听图片上传成功
      handleSuccess(response) {
        //拼接得到一个图片信息对象
        const picInfo = {pic: response.data.tmp_path}
        //将图片信息push到pics中
        this.addForm.pics.push(picInfo)
      },
      //添加商品
      addProduct() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) {
            return this.$message.error('请填写必要的表单项')
          }
          //执行添加
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
          //处理动态参数
          this.manyTableDate.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          //处理静态属性
          this.onlyTableDate.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          form.attr=this.addForm.attrs
          //发起请求添加商品
          addProduct(form).then(res=>{
            console.log(res)
          })
        })
      }
    },
    computed: {
      cateId() {
        if (this.addForm.goods_cat.length === 3) {
          return this.addForm.goods_cat[2]
        }
        return null
      }
    }
  }
</script>

<style scoped>
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }

  .previewImg {
    width: 100%;
  }

  .btnAdd {
    margin-top: 15px;
  }
</style>