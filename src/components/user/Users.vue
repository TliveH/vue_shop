<template>
  <div>
    <!--  面包屑导航  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图  -->
    <el-card>
      <!--   搜索与下拉   -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--   用户列表   -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--      修改      -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>

            <!--      删除      -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>

            <!--     分配角色       -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--   分页   -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

    <!--  添加用户对话框  -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
      <!--   内容   -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--   底部   -->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--  修改用户的对话框  -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>

    <!--  分配角色对话框  -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="40%" @close="setRoleDialogClosed" l>
      <div>
        <p>当前的用户:{{userInfo.username}}</p>
        <p>当前的角色:{{userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addUser,
    getUserList,
    showEditDialog,
    userStateChanged,
    editUserInfo,
    removeUserById, saveRoleInfo
  } from '../../network/users'
  import {getRolesList} from '../../network/roles'

  export default {
    name: "Users",
    data() {
      //验证邮箱的规则
      var checkEmail = (rule, value, cb) => {
        //正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
      }
      //验证手机号的规则
      var checkMobile = (rule, value, cb) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
          return cb()
        }
        cb(new Error('请输入合法的手机号'))
      }
      return {
        queryInfo: {
          query: '',
          //当前页数
          pagenum: 1,
          //当前每页显示数据
          pagesize: 10
        },
        userList: [],
        total: 0,
        //控制添加用户对话框显示与隐藏
        addDialogVisible: false,
        //添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        //添加表单的验证规则对象
        addFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}
          ]
        },
        //控制修改用户对话框显示与隐藏
        editDialogVisible: false,
        //查询到的用户信息对象
        editForm: {},
        //控制分配角色对话框显示与隐藏
        setRoleDialogVisible: false,
        //需要被分配角色的用户信息
        userInfo: {},
        //获取所有角色的列表
        rolesList: [],
        //已选中的角色id值
        selectRoleId: ''
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      getUserList() {
        getUserList(this.queryInfo).then(res => {
          // console.log(res)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.userList = res.data.users
          this.total = res.data.total
        })
      },
      //监听pagesize改变
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      //监听页码值改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      //监听Switch开关状态的改变
      userStateChanged(userInfo) {
        userStateChanged(userInfo).then(res => {
          // console.log(res)
          if (res.meta.status !== 200) {
            userInfo.mg_state = !userInfo.mg_state
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
        })
      },
      //监听添加用户对话框的关闭
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      //点击按钮添加用户
      addUser() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return
          //发起添加用户的网络请求
          addUser(this.addForm).then(res => {
            // console.log(res)
            if (res.meta.status !== 201) {
              return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            //隐藏添加用户的对话框
            this.addDialogVisible = false
            //重新获取用户列表数据
            this.getUserList()
          })
        })
      },
      //编辑用户的对话框
      showEditDialog(id) {
        showEditDialog(id).then(res => {
          // console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.editForm = res.data
        })

        this.editDialogVisible = !this.editDialogVisible
      },
      //监听修改用户对话框的关闭
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      //修改用户信息并提交
      editUserInfo() {
        this.$refs.editFormRef.validate(valid => {
          if (!valid) return
          //发起修改用户的网络请求
          editUserInfo(this.editForm).then(res => {
            console.log(res)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            //关闭对话框
            this.editDialogVisible = false
            //刷新数据列表
            this.getUserList()
            this.$message.success(res.meta.msg)
          })
        })
      },
      //根据id删除对应用户信息
      removeUserById(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          if (res !== 'confirm') {
            return this.$message.info('已取消删除')
          }
          removeUserById(id).then(res => {
            // console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getUserList()
          })
        }).catch(err => err)
      },
      //展示分配角色的对话框
      setRole(userInfo) {
        this.userInfo = userInfo
        //在展示对话框之前，获取所有角色的列表
        getRolesList().then(res => {
          // console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.rolesList = res.data
        })
        this.setRoleDialogVisible = true
      },
      //点击按钮分配角色
      saveRoleInfo() {
        if (!this.selectRoleId) {
          return this.$message.error('请选择要分配的角色')
        }
        saveRoleInfo(this.userInfo, this.selectRoleId).then(res => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getUserList()
          this.setRoleDialogVisible = false
        })
      },
      //监听分配角色的对话框的关闭事件
      setRoleDialogClosed(){
        this.selectRoleId=''
        this.userInfo=''
      }
    }
  }
</script>

<style scoped>

</style>