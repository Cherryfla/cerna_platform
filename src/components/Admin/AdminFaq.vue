<template>
    <div>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="issueQueryInfo.search"
                    clearable @clear="getIssueList">
            <el-button slot="append" icon="el-icon-search" @click="getIssueList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addIssueDialogVisible = true">添加问题</el-button>
        </el-col>
      </el-row>
      <el-collapse accordion @change="handleChange">
        <el-collapse-item v-for="(item, index) in issueList" :key="item.pk" :name="index">
          <template slot="title">
            <el-badge :is-dot="item.fields.answer == 'No_Answer'">
              <div style="height: 30px; line-height: 30px">
                {{item.fields.question}}
              </div>
            </el-badge>
          </template>
          <el-form ref="issueFormRef" :model="issueForm" :rules="issueFormRules">
            <el-form-item prop="answer">
              <el-input type="textarea" rows="3" v-model="issueForm.answer"></el-input>
            </el-form-item>
            <el-form-item label="Last Edit by:">
              <el-row>
                <el-col :span="4">
                  <el-input v-model="issueForm.author" disabled></el-input>
                </el-col>
                <el-col :span="16" style="text-align: right">
                  <el-button type="primary" @click="editIssue(item.pk)">发布</el-button>
                  <el-button type="danger" @click="deleteIssue(item.pk)">删除</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <!--分页区域-->
      <el-pagination
        @size-change="handleIssueSizeChange"
        @current-change="handleIssueCurrentChange"
        :current-page="issueQueryInfo.pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="issueQueryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="issueTotal">
      </el-pagination>
      <!--添加问题对话框-->
      <el-dialog title="添加问题" :visible.sync="addIssueDialogVisible" width="50%" @close="addIssueDialogClose">
        <el-form :model="addIssueForm" ref="addIssueFormRef" :rules="issueFormRules"
                 label-position="top">
          <el-form-item label="Question" prop="question">
            <el-input type="textarea" v-model="addIssueForm.question"></el-input>
          </el-form-item>
          <el-form-item label="Answer" prop="answer">
            <el-input type="textarea" v-model="addIssueForm.answer"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addIssueDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addIssue">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'AdminFaq',
    created () {
      this.getIssueList()
    },
    data() {
      return {
        issueList: [],
        issueTotal: 0,
        issueQueryInfo: {
          search: '',
          pageNum: 1,
          pageSize: 5
        },
        issueForm: {
          id: null,
          answer: '',
          author: ''
        },
        issueFormRules: {
          answer: [
            {
              required: true,
              message: 'answer is required',
              trigger: 'blur'
            },
            {
              max: 100,
              message: 'length between 0 and 100',
              trigger: 'blur'
            }
          ],
          question: [
            {
              required: true,
              message: 'question is required',
              trigger: 'blur'
            },
            {
              max: 200,
              message: 'length between 0 and 200',
              trigger: 'blur'
            }
          ]
        },
        addIssueDialogVisible: false,
        addIssueForm: {
          question: '',
          answer: ''
        }
      }
    },
    methods: {
      async getIssueList(){
        const res = await this.$http.get('faq/getissue', {
          params: this.issueQueryInfo
        }).catch(error => {
          if (error.response) {
            return this.$message.error(error.response.data);
          }
          else {
            return this.$message.error(error.message);
          }
        })
        // console.log(res)
        if(res.status !== 200)
          return this.$message.error('get issue list failed')
        this.issueList = res.data.list
        this.issueTotal = res.data.total
      },
      handleIssueCurrentChange(newPage){
        this.issueQueryInfo.pageNum = newPage
      },
      handleIssueSizeChange(newSize){
        this.issueQueryInfo.pageSize = newSize
      },
      handleChange(activeName){
        let currentIssue = this.issueList[activeName]
        if(!currentIssue)
          return
        this.issueForm.answer = currentIssue.fields.answer
        this.issueForm.author = currentIssue.fields.author
        // console.log(this.issueForm.answer)
      },
      editIssue(issueId){
        this.issueForm.id = issueId
        this.$refs.issueFormRef[0].validate(async valid => {
          if(!valid)
            return
          const res = await this.$http.put('admin/issuemanage', this.issueForm).catch(error => {
            if (error.response) {
              this.$message.error(error.response.data);
            }
            else {
              this.$message.error(error.message);
            }
          })
          if(res.status !== 200)
            return this.$message.error('Edit issue failed')
          if(res.data.msg != 'success')
            return this.$message.error(res.data.msg)
          this.getIssueList()
          return this.$message.success('Success')
        })
      },
      addIssueDialogClose(){
        this.$refs.addIssueFormRef.resetFields()
      },
      addIssue(){
        this.$refs.addIssueFormRef.validate(async valid => {
          if (!valid)
            return
          const res = await this.$http.post('admin/issuemanage', this.addIssueForm).catch(error => {
            if (error.response) {
              this.$message.error(error.response.data);
            }
            else {
              this.$message.error(error.message);
            }
          })
          if(res.status !== 200)
            return this.$message.error('Add issue failed')
          if(res.data.msg != 'success')
            return this.$message.error(res.data.msg)
          this.getIssueList()
          this.addIssueDialogVisible = false
          return this.$message.success('success')
        })
      },
      async deleteIssue(issueId){
        const confirmResult = await this.$confirm('此操作将永久删除该问题, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        if(confirmResult !== 'confirm'){
          this.$message.info('取消删除')
        }
        else{
          const res = await this.$http.delete('admin/issuemanage', {
            params: {
              'issueId': issueId
            }
          })
          if(res.status !== 200){
            return this.$message.error('Delete issue failed')
          }
          if (res.data.msg !== 'success')
            return this.$message.error(res.data.msg)
          this.getIssueList()
          return this.$message.success('delete success')
        }
      }
    }
  }
</script>

<style scoped>
  .el-collapse{
    margin-top: 10px;
  }
</style>
