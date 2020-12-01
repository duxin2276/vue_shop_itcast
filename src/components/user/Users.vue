<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="userDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域  -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="swithStatusChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="role_name" width="180px">
          <template slot-scope="scope">
            <!-- 更改信息 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialogVisible(scope.row.id)"
            ></el-button>
            <!-- 删除数据 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 分配权限 -->

            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-star-off"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="userDialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="userAddForm"
        :rules="userAddFormRules"
        ref="userFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userAddForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userAddForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userAddForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userAddForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 校验邮箱
    var checkEmail = (rule, value, callback) => {
      var regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的邮箱'))
    }
    // 校验手机号
    var checkMobile = (rule, value, callback) => {
      var regMobile = /^1[3456789]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号'))
    }
    return {
        // 获取用户列表需要用到的请求参数
        queryInfo: {
            query: '',
            pagenum: 1,
            pagesize: 5
        },
        // 总记录数
        total:0,
        // 用户数据
        userList: [],
        // 控制添加用户对话框显示隐藏
        userDialogVisible: false,

        // 添加用户表单
        userAddForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },

        // 添加用户表单规则
        userAddFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ]
        },
        // 控制修改对话框的显示
        editDialogVisible: false,
        // 用来保存修改信息的对象
        editForm: {},
        // 修改用户表单  校验规则对象
        editFormRules: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ]
        }
    }
  },
  mounted () {
      this.getUserList()
  },
  methods: {
      // 发送请求获取数据
     async getUserList() {
          const { data: res } = await this.$http.get('users', { params: this.queryInfo })
        //   console.log(res);
        // 获取数据失败
        if (res.meta.status !== 200) {
            this.$message({
                message: '获取数据失败',
                type: 'error',
                showClose: true,
                duration: 3000,
            });
        }
        // 获取数据成功
            this.$message({
                message: '获取数据成功',
                type: 'success',
                showClose: true,
                duration: 3000,
            });
            this.queryInfo.pagenum = res.data.pagenum
            this.total = res.data.total
            this.userList = res.data.users
      },
      // 每页显示多少条数据
      handleSizeChange(val) {
        this.queryInfo.pagesize = val
        // console.log(`每页 ${val} 条`);
        this.getUserList()
      },
      // 当前页
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.queryInfo.pagenum = val
        this.getUserList()
      },
      // 监听switch开关的状态变化
     async swithStatusChanged(userInfo) {
        // console.log(userInfo);
        // 发送请求修改用户状态
        const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        // 修改失败
        if (res.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state
          this.$message({
            message: '修改用户状态失败',
            type: 'error',
            showClose: true,
            duration: 3000,
          });
        }
        // 修改成功
        this.$message({
          message: '修改用户状态成功',
          type: 'success',
          showClose: true,
          duration: 3000,
        });
      },
      // 监听对话框的关闭事件
       closeDialog() {
         this.$refs.userFormRef.resetFields()
       },
       // 点击确定按钮，添加用户信息
       addUser() {
         this.$refs.userFormRef.validate(async valid => {
           // 校验失败 直接返回
           if (!valid) return

           // 发送请求 更新数据
            const { data: res } = await this.$http.post('users', this.userAddForm)
            // 添加失败
            if (res.meta.status !== 201) {
              this.$message({
                message: '添加新用户失败',
                type: 'error',
                showClose: true,
                duration: 3000,
              });
              
            }
            // 添加新用户成功
            this.$message({
              message: '添加新用户成功',
              type: 'success',
              showClose: true,
              duration: 3000,
            });
            // 更新数据
            this.getUserList()

            // 关闭对话框
            this.userDialogVisible = false
         })
       },
       // 修改用户信息对话框
      async showEditDialogVisible(id) {
        this.editDialogVisible = true
         // 根据id查询用户信息
         const { data: res } = await this.$http.get(`users/${id}`)
         // 查询用户信息失败
         if (res.meta.status !== 200) {
           this.$message({
             message: '未找到用户信息',
             type: 'error',
             showClose: true,
             duration: 3000,
           });
           
         }
         // 查询用户信息成功
         this.$message({
           message: '查询用户信息成功',
           type: 'success',
           showClose: true,
           duration: 3000,
         });
         this.editForm = res.data
       },
       // 关闭修改对话框重置表单
       editDialogClosed() {
         this.$refs.editFormRef.resetFields()
       },
       // 把修改后的信息进行提交
       editUserInfo() {
         this.$refs.editFormRef.validate(async valid => {
           console.log(valid);
          //  校验失败 直接返回
           if (!valid) return
           // 发送请求 提交数据
           const { data: res } = await this.$http.put(`users/${this.editForm.id}`,this.editForm)
           // 提示用户修改数据失败
           if (res.meta.status !== 200) {
             this.$message({
               message: '修改数据失败',
               type: 'error',
               showClose: true,
               duration: 3000,
             });
             
           }
           // 提示用户修改数据成功
           this.$message({
             message: '修改数据成功',
             type: 'success',
             showClose: true,
             duration: 3000,
           });
           // 关闭对话框
           this.editDialogVisible = false
           // 刷新数据
           this.getUserList()

         })
       },
       // 删除用户信息
       deleteUser(id) {
        // 这是一个消息提示框
        this.$confirm('此操作将永久删除该用户, 是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async action => {
          // 发送请求 删除数据
         const { data: res } = await this.$http.delete(`users/${id}`)

         // 提示用户删除用户信息失败
         if (res.meta.status !== 200) {
           this.$message({
             message: '删除用户信息失败',
             type: 'error',
             showClose: true,
             duration: 3000,
           });
           
         }
         // 提示用户删除用户信息成功
         this.$message({
           message: '删除用户信息成功',
           type: 'success',
           showClose: true,
           duration: 3000,
         });
         // 刷新数据
         this.getUserList()
          
        }).catch((err) => {
          if (err) {
            this.$message({
              message: '已经取消该操作',
              type: 'info',
              showClose: true,
              duration: 3000,
            });
            
          }
        });
        
         
       }
  }
}
</script>

<style lang="less" scoped>
</style>
