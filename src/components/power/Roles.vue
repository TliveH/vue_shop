<template>
  <div>
    <!--  面包屑导航  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图  -->
    <el-card>
      <!--   添加角色按钮   -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--   角色列表   -->
      <el-table :data="rolesList" border stripe>
        <!--    展开列    -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children"
                    :key="item1.id">
              <!--    渲染一级权限    -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--    渲染二级，三级权限    -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级菜单 -->
                <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3,i3) in item2.children" :key="item3.id" type="warning" closable
                            @close="removeRightById(scope.row,item3.id)">{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--    索引列    -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!--      修改      -->
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>

            <!--      删除      -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>

            <!--     分配角色       -->
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--  分配权限的对话框  -->
    <el-dialog title="提示" :visible.sync="setRightDialogVisible" width="40%" @close="setRightDialogClosed">
      <!--   树形控件   -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {allotRights, getRolesList, removeRightById, showSetRightDialog} from '../../network/roles'

  export default {
    name: "Roles",
    data() {
      return {
        //所有角色列表
        rolesList: [],
        //控制分配权限对话框的显示与隐藏
        setRightDialogVisible: false,
        //所有权限的数据
        rightsList: [],
        //树形控件的属性绑定对象
        treeProps:{
          label:'authName',
          children:'children'
        },
        //默认选中的节点id值数组
        defKeys:[],
        //即将分配权限的id
        roleId:''
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      getRolesList() {
        getRolesList().then(res => {
          // console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.rolesList = res.data
        })
      },
      //根据id删除对应的权限
      removeRightById(role, rightId) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          if (res !== 'confirm') {
            return this.$message.info('已取消删除')
          }
          removeRightById(role, rightId).then(res => {
            // console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            // this.getRolesList()
            role.children = res.data
          })
        }).catch(err => err)
      },
      //展示分配权限的对话框
      showSetRightDialog(role) {
        this.roleId=role.id
        showSetRightDialog().then(res => {
          // console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.rightsList = res.data
        })
        //递归获取三级节点的id
        this.getLeafKeys(role,this.defKeys)
        this.setRightDialogVisible = true
      },
      //通过递归的形式获取角色下所有三级权限的id，并保存到数组中
      getLeafKeys(node,arr){
        //如果当前node节点不包含children属性，则是三级节点
        if(!node.children){
          return arr.push(node.id)
        }
        node.children.forEach(item=>{
          this.getLeafKeys(item,arr)
        })
      },
      //监听分配权想对话框的关闭事件
      setRightDialogClosed(){
        this.defKeys=[]
      },
      //点击为角色分配权限
      allotRights(){
        const keys=[
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys(),
        ]
        const idStr=keys.join(',')
        allotRights(this.roleId,idStr).then(res=>{
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getRolesList()
          this.setRightDialogVisible=false
        })
      }
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>