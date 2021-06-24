<template>
  <div>
    <!--  面包屑导航  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片试图  -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--   表格   -->
      <tree-table class="tree-table" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false"
                  show-index
                  index-text="#" border :show-row-hover="false">
        <!--    是否有效    -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!--    排序    -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!--    操作    -->
        <template slot="opt" slot-scope="scope">
          <!--      编辑      -->
          <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="showEditDialog(scope.row.cat_id)"></el-button>
          </el-tooltip>
          <!--      删除      -->
          <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeCateById(scope.row.cat_id)"></el-button>
          </el-tooltip>
        </template>
      </tree-table>
      <!--   分页   -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total" background>
      </el-pagination>
    </el-card>
    <!--  添加分类的对话框  -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="40%" @close="addCateDialogClosed">
      <!--   添加分类的表单   -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!--  options用来指定数据源   -->
          <!--  props用来指定配置对象   -->
          <el-cascader expand-trigger="hover" v-model="selectedKeys" :options="parentCateList" :props="cascaderProps"
                       @change="parentCateChange" clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>

    <!--  修改分类的对话框  -->
    <el-dialog title="修改分类" :visible.sync="editCateDialogVisible" width="40%" @close="editCateDialogClosed">
      <el-form :model="editCateForm" :rules="addCateFormRules" ref="editCateFormRef" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCateInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {addCate, editCateInfo, getCateList, removeCateById, showEditDialog} from '../../network/cate'

  export default {
    name: "Cate",
    data() {
      return {
        //查询条件
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        //商品分类的数据列表
        cateList: [],
        //总数据条数
        total: 0,
        //为table指定列的定义
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name'
          },
          {
            label: '是否有效',
            //表示将当前列定义为模板页
            type: 'template',
            //表示当前页使用的模板名称
            template: 'isok'
          },
          {
            label: '排序',
            //表示将当前列定义为模板页
            type: 'template',
            //表示当前页使用的模板名称
            template: 'order'
          },
          {
            label: '操作',
            //表示将当前列定义为模板页
            type: 'template',
            //表示当前页使用的模板名称
            template: 'opt'
          }
        ],
        //控制添加分类对话框的显示与隐藏
        addCateDialogVisible: false,
        //添加分类的表单数据对象
        addCateForm: {
          cat_name: '',
          //父级分类的id
          cat_pid: 0,
          //分类的等级
          cat_level: 0
        },
        //添加分类表单的验证规则
        addCateFormRules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'}
          ]
        },
        //父级分类的列表
        parentCateList: [],
        //指定级联选择器的配置对象
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        //选中的父级分类的id数组
        selectedKeys: [],
        //分类信息对象
        editCateForm: {},
        //控制修改分类对话框显示与隐藏
        editCateDialogVisible: false
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      //获取商品分类数据
      getCateList() {
        getCateList(this.queryInfo).then(res => {
          // console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.cateList = res.data.result
          this.total = res.data.total
        })
      },
      //监听pagesize改变
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getCateList()
      },
      //监听pagenum改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getCateList()
      },
      //点击按钮显示添加分类的对话框
      showAddCateDialog() {
        this.getParentCateList()
        this.addCateDialogVisible = true
      },
      //获取父级分类的数据列表
      getParentCateList() {
        getCateList(this.queryInfo.type = 2).then(res => {
          // console.log(res.data)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.parentCateList = res.data
        })
      },
      //选择项发生变化时触发
      parentCateChange() {
        if (this.selectedKeys.length > 0) {
          //父级分类的id
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          //为当前分类的等级赋值
          this.addCateForm.cat_level = this.selectedKeys.length
          return
        } else {
          //父级分类的id
          this.addCateForm.cat_pid = 0
          //为当前分类的等级赋值
          this.addCateForm.cat_level = 0
        }
      },
      //点击按钮添加新的分类
      addCate() {
        this.$refs.addCateFormRef.validate(valid => {
          if (!valid) return
          addCate(this.addCateForm).then(res => {
            // console.log(res)
            if (res.meta.status !== 201) {
              return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getCateList()
            this.addCateDialogVisible = false
          })
        })
      },
      //监听对话框的关闭事件，重置表单数据
      addCateDialogClosed() {
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      },
      //修改对话框
      showEditDialog(cat_id) {
        showEditDialog(cat_id).then(res => {
          // console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.editCateForm = res.data
        })
        this.editCateDialogVisible = !this.editCateDialogVisible
      },
      //监听修改用户对话框的关闭
      editCateDialogClosed() {
        this.$refs.editCateFormRef.resetFields()
      },
      //修改用户信息并提交
      editCateInfo() {
        this.$refs.editCateFormRef.validate(valid => {
          if (!valid) return
          //发起修改用户的网络请求
          editCateInfo(this.editCateForm).then(res => {
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            //关闭对话框
            this.editCateDialogVisible = false
            //刷新数据列表
            this.getCateList()
            this.$message.success(res.meta.msg)
          })
        })
      },
      //根据id删除对应分类
      removeCateById(cat_id) {
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          if (res !== 'confirm') {
            return this.$message.info('已取消删除')
          }
          removeCateById(cat_id).then(res => {
            // console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getCateList()
          })
        }).catch(err => err)
      }
    }
  }
</script>

<style scoped>
  .tree-table {
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%;
  }
</style>