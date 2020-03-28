<template>
    <div>
      <!--搜索区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入用户名" v-model="userQueryInfo.search"
                    clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--用户列表区域-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="Username" prop="pk"></el-table-column>
        <el-table-column label="Register time" prop="fields.register_time"></el-table-column>
        <el-table-column label="Password">
          <template slot-scope="scope">
            {{scope.row.fields.power == 0?'******':scope.row.fields.password}}
          </template>
        </el-table-column>
        <el-table-column label="Email" prop="fields.email"></el-table-column>
        <el-table-column label="Power" prop="fields.power"></el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" :disabled="scope.row.fields.power === 0"
                       size="mini" @click="showEditUserDialog(scope.$index)"></el-button>
            <el-button type="danger" icon="el-icon-delete" :disabled="scope.row.fields.power === 0"
                       size="mini" @click="deleteUser(scope.row.pk)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleUserSizeChange"
        @current-change="handleUserCurrentChange"
        :current-page="userQueryInfo.pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="userQueryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userTotal">
      </el-pagination>

      <!--修改用户的对话框-->
      <el-dialog title="修改用户" :visible.sync="editUserDialogVisible" width="50%" @close="editUserDialogClosed">
        <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editUserForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="权限" prop="power">
            <el-select v-model="editUserForm.power">
              <el-option label="1" value="1"></el-option>
              <el-option label="5" value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'AdminUser',
    created () {
      this.getUserList()
    },
    data(){
      return {
        userQueryInfo: {
          search: '',
          pageNum: 1,
          pageSize: 5
        },
        userTotal: 0,
        userList: [],
        editUserForm: {
          username: '',
          password: '',
          power: 5
        },
        editUserDialogVisible: false,
        //编辑用户表单的规则
        editUserFormRules:{
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 8,
              max: 16,
              message: '长度在 8 到 16 个字符之间',
              trigger: 'blur'
            }
          ],
          power: [
            {
              required: true,
              message: '选择权限',
              trigger: 'blur'
            }
          ]
        },
      }
    },
    methods: {
      async getUserList(){
        const res = await this.$http.get('admin/usermanage',
          {
            params: this.userQueryInfo
          }
        ).catch(error => {
          if (error.response) {
            this.$message.error(error.response.data);
          }
          else {
            this.$message.error(error.message);
          }
        })
        if(res.status !== 200)
          this.$message.error('Get user list failed')
        if(res.data.msg !== 'success')
          this.$message.error(this.data.msg)
        this.userList = res.data.list
        this.userTotal = res.data.total
      },
      showEditUserDialog(index){
        this.editUserForm.username = this.userList[index].pk
        this.editUserForm.password = this.userList[index].fields.password
        this.editUserForm.power = this.userList[index].fields.power
        // console.log(this.editUserForm)
        this.editUserDialogVisible = true
      },
      async deleteUser(username){
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        //如果用户确认删除,则返回值为'confirm'
        //如果用户取消删除,则返回值为'cancel'
        if (confirmResult !== 'confirm') {
          this.$message.info('取消删除')
        }
        else {
          const res = await this.$http.delete('admin/usermanage', {
            params: {
              'username': username
            }
          })
          if (res.status !== 200) {
            return this.$message.error('Delete user failed')
          }
          if (res.data.msg !== 'success')
            return this.$message.error(res.data.msg)
          this.getUserList()
          return this.$message.success('delete success')
        }
      },
      handleUserSizeChange(newSize){
        this.userQueryInfo.pageSize = newSize
        this.getUserList()
      },
      handleUserCurrentChange(newPage){
        this.userQueryInfo.pageNum = newPage
        this.getUserList()
      },
      editUserDialogClosed(){
        this.$refs.editUserFormRef.resetFields()
      },
      editUserInfo(){
        this.$refs.editUserFormRef.validate(async valid => {
          if(!valid)
            return
          const res = await this.$http.put('admin/usermanage', this.editUserForm).catch(error => {
            if (error.response) {
              this.$message.error(error.response.data);
            } else {
              this.$message.error(error.message);
            }
          })
          if(res.status !== 200)
            return this.$message.error('Edit User failed')
          if(res.data.msg !== 'success')
            return this.$message.error(res.data.msg)
          this.getUserList()
          this.editUserDialogVisible = false
          return this.$message.success('Success')
        })
      }
    }
  }
</script>

<style scoped>

</style>
