<template>
  <div style="height: 100%;">
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>FAQ</el-breadcrumb-item>
    </el-breadcrumb>
    <!--主体区域-->
    <el-card>
      <el-tabs v-model="activeName">
        <!--Issues 标签-->
        <el-tab-pane label="Issues" name="issues">
          <el-collapse v-model="activeNames">
            <el-collapse-item v-for="(item, index) in issueList" :key="item.pk"
                              :title="item.fields.question" :name="index">
              <div>{{item.fields.answer}}</div>
              <div style="text-align: right;">{{item.fields.date}}</div>
              <div style="text-align: right;" v-if="item.fields.answer !== 'No_Answer'">Post By: {{item.fields.author}}</div>
            </el-collapse-item>
          </el-collapse>
          <!--分页区域-->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-tab-pane>
        <!--New Issue标签-->
        <el-tab-pane label="New Issue" name="new_issue">
          <el-form ref="newIssueFormRef" :model="newIssueForm"
                   :rules="newIssueFormRules" label-position="top">
            <el-form-item label="Your Question:" prop="question">
              <el-input type="textarea" class="questionBox" :rows="12"
                        :model="newIssueForm.question" v-model="newIssueForm.question"
                        placeholder="write you question here"></el-input>
            </el-form-item>
            <div class="button-box">
              <el-button type="primary" @click="issueFormSubmit">Submit</el-button>
              <el-button type="danger" @click="resetIssueForm">Reset</el-button>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'FAQ.vue',
    created () {
      this.getIssueList()
    },
    data() {
      return {
        activeName: 'issues',
        activeNames: [],
        queryInfo: {
          search: '',
          pageNum: 1,
          pageSize: 5
        },
        issueList: [],
        total: 0,
        newIssueForm: {
          question: ''
        },
        newIssueFormRules:{
          question:[
            {
              required: true,
              message: 'Please finish your question',
              trigger: 'blur'
            },
            {
              min: 0,
              max: 200,
              message: 'Maximum character: 200',
              trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      async getIssueList(){
        const res = await this.$http.get('faq/getissue', {
          params: this.queryInfo
        }).catch(error => {
          if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
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
        this.total = res.data.total
        this.activeNames = []
        for(let i = 0;i < this.queryInfo.pageSize; i++)
          this.activeNames.push(i)
      },
      handleSizeChange(newSize){
        this.queryInfo.pageSize = newSize
        this.getIssueList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pageNum = newPage
        this.getIssueList()
      },
      issueFormSubmit(){
        this.$refs.newIssueFormRef.validate( async valid => {
          if(!valid)
            return this.$message.error('Please finish your question')
          const res = await this.$http.post('faq/newissue', this.newIssueForm).catch(
            error => {
              if (error.response) {
                // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                this.$message.error(error.response.data);
              }
              else {
                this.$message.error(error.message);
              }
            }
          )
          if(res.status !== 200)
            return this.$message.error('Post issue failed')
          this.$message.success('Post issue success')
          this.getIssueList()
          this.activeName = 'issues'
        })
      },
      resetIssueForm(){
        this.$refs.newIssueFormRef.resetFields()
      }
    }
  }
</script>

<style scoped>
  .el-card{
    margin-top: 10px;
  }
  .button-box{
    margin-top: 20px ;
    text-align: center;
  }
  .el-button{
    width: 250px;
  }
</style>
