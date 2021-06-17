<template>
  <div>
    <!--  面包屑导航  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图  -->
    <el-card>
      <!--   头部警告   -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon>
      </el-alert>
      <!--   选择商品分类   -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!--   设置商品分类的级联选择框   -->
          <el-cascader expand-trigger="hover" v-model="seletedCateKeys" :options="cateList" :props="cateProps"
                       @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!--   tab页签区   -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!--  添加动态参数的面板  -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数
          </el-button>
          <!--  动态参数表格  -->
          <el-table :data="manyTableDate" border stripe>
            <!--  展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--  循环渲染tag标签  -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClosed(i,scope.row)">
                  {{item}}
                </el-tag>
                <!--  输入的文本框  -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                          ref="saveTagInput" size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!--  添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <!--  索引列  -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!--  编辑   -->
                <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                  <el-button type="primary" icon="el-icon-edit" size="mini"
                             @click="showEditDialog(scope.row.attr_id)"></el-button>
                </el-tooltip>
                <!--   删除   -->
                <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini"
                             @click="removeParams(scope.row.attr_id)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--  添加静态属性的面板  -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性
          </el-button>
          <!--  静态参数表格  -->
          <el-table :data="onlyTableDate" border stripe>
            <!<!--  展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--  循环渲染tag标签  -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClosed(i,scope.row)">
                  {{item}}
                </el-tag>
                <!--  输入的文本框  -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                          ref="saveTagInput" size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!--  添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <!--  索引列  -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!--  编辑   -->
                <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                  <el-button type="primary" icon="el-icon-edit" size="mini"
                             @click="showEditDialog(scope.row.attr_id)"></el-button>
                </el-tooltip>
                <!--   删除   -->
                <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini"
                             @click="removeParams(scope.row.attr_id)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--  添加参数的对话框  -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
      <!--  添加参数的对话框  -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
    </el-dialog>
    <!--  修改参数的对话框  -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="40%" @close="editDialogClosed">
      <!--  修改参数的对话框  -->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getCateList} from '../../network/cate'
  import {addParams, getParamsList, showEditDialog, editParams, removeParams, editParam} from '../../network/params'

  export default {
    name: "Params",
    data() {
      return {
        //查询条件
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        //商品分类列表
        cateList: [],
        //级联选择框的配置对象
        cateProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        //级联选择框双向绑定数组
        seletedCateKeys: [],
        //被激活的页签名称
        activeName: 'many',
        //动态参数的数据
        manyTableDate: [],
        //静态参数的数据
        onlyTableDate: [],
        //控制添加对话框的显示与隐藏
        addDialogVisible: false,
        //添加参数的表单对象
        addForm: {
          attr_name: ''
        },
        //添加表单的验证规则对象
        addFormRules: {
          attr_name: [
            {required: true, message: '请输入参数名称', trigger: 'blur'}
          ]
        },
        //控制修改对话框的显示与隐藏
        editDialogVisible: false,
        //修改的表单数据对象
        editForm: {},
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
      //级联选择框变化时触发
      handleChange() {
        this.getParamsData()
      },
      //tab页签点击事件的函数
      handleTabClick() {
        this.getParamsData()
      },
      //获取参数的列表数据
      getParamsData() {
        if (this.seletedCateKeys.length !== 3) {
          this.seletedCateKeys = []
          this.manyTableDate = []
          this.onlyTableDate = []
          return
        }
        //根据所选分类的Id,和当前所处面板，获取对应参数
        getParamsList(this.cateId, this.activeName).then(res => {
          // console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            //控制文本框的显示与隐藏
            item.inputVisible = false
            //文本框中输入的值
            item.inputValue = ''
            // console.log(item.attr_vals)
          })
          if (this.activeName === 'many') {
            this.manyTableDate = res.data
          } else {
            this.onlyTableDate = res.data
          }
        })
      },
      //监听对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      //点击按钮添加参数
      addParams() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return
          addParams(this.cateId, this.addForm, this.activeName).then(res => {
            // console.log(res)
            if (res.meta.status !== 201) {
              return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.addDialogVisible = false
            this.getParamsData()
          })
        })
      },
      //点击按钮展示修改的对话框
      showEditDialog(attr_id) {
        //查询当前参数的信息
        showEditDialog(this.cateId, attr_id, this.activeName).then(res => {
          // console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.editForm = res.data
        })
        this.editDialogVisible = true
      },
      //重置修改的表单
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      //点击按钮修改参数信息
      editParams() {
        this.$refs.editFormRef.validate(valid => {
          if (!valid) return
          editParams(this.cateId, this.editForm, this.activeName).then(res => {
            // console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getParamsData()
            this.editDialogVisible = false
          })
        })
      },
      //根据id删除对应参数
      removeParams(attr_id) {
        this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          if (res !== 'confirm') {
            return this.$message.info('已取消删除')
          }
          removeParams(this.cateId, attr_id).then(res => {
            // console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getParamsData()
          })
        })
      },
      //文本框失去焦点或者按下enter时触发
      handleInputConfirm(row) {
        if (row.inputValue.trim().length === 0) {
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        //输入的内容需要做后续处理
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        this.saveAtterVals(row)
      },
      //点击按钮展示文本输入框
      showInput(row) {
        row.inputVisible = true
        //让文本框自动获得焦点
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      saveAtterVals(row) {
        editParam(this.cateId, row).then(res => {
          // console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
        })
      },
      //删除对应的参数
      handleClosed(i, row) {
        row.attr_vals.splice(i, 1)
        this.saveAtterVals(row)
      }
    },
    computed: {
      //如果按钮需要被禁用，则返回true，否则返回false
      isBtnDisabled() {
        if (this.seletedCateKeys.length !== 3)
          return true
        return false
      },
      //当前选中的三级分类的id
      cateId() {
        if (this.seletedCateKeys.length === 3)
          return this.seletedCateKeys[2]
        return null
      },
      //动态计算标题文本
      titleText() {
        if (this.activeName === 'many')
          return '动态参数'
        return '静态属性'
      }
    }
  }
</script>

<style scoped>
  .cat_opt {
    margin: 15px 0;
  }

  .el-cascader {
    padding-left: 15px;
  }

  .el-tag {
    margin: 10px;
  }

  .input-new-tag {
    width: 120px;
  }

  .button-new-tag {
    width: 120px;
  }
</style>