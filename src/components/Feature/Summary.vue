<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Feature</el-breadcrumb-item>
      <el-breadcrumb-item>Summary</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--搜索区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="Please input data name" v-model="queryInfo.search"
                    clearable @clear="getSummaryList">
            <el-button slot="append" icon="el-icon-search" @click="getSummaryList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="summaryList" stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item label="Data Name">
                {{scope.row.fields.name}}
              </el-form-item>
              <el-form-item label="Post User">
                {{scope.row.fields.author}}
              </el-form-item>
              <el-form-item label="Post Time">
                {{scope.row.fields.date}}
              </el-form-item>
              <el-form-item label="Source">
                {{scope.row.fields.source}}
              </el-form-item>
              <el-form-item label="Description">
                {{scope.row.fields.description}}
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="Data">
          <template slot-scope="scope" >
            <el-tag type="info" style="cursor:pointer" @click="goToData(scope.row.fields.name)">
              {{scope.row.fields.name}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Uploader" prop="fields.author"></el-table-column>
        <el-table-column label="Source" prop="fields.source"></el-table-column>
        <el-table-column width="300px" label="Post time" prop="fields.date"></el-table-column>
        <el-table-column width="250px" label="Operation" v-if="power <= 1">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="showEditSummaryDialog(scope.$index)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="deleteSummary(scope.row.fields.name)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="编辑数据" :visible.sync="editSummaryVisible" width="50%" @close="editSummaryClose">
      <el-form :model="editSummaryForm" ref="editSummaryFormRef" :rules="editSummaryFormRef">
        <el-form-item label="Source:" prop="source">
          <el-input v-model="editSummaryForm.source"></el-input>
        </el-form-item>
        <el-form-item label="Description:" prop="description">
          <el-input type="textarea" v-model="editSummaryForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSummaryVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSummary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Summary',
    props: ['power'],
    watch: {
      power: function (val) {}
    },
    created () {
      this.getSummaryList()
    },
    data () {
      return {
        summaryList: [],
        //数据总数
        total: 0,
        queryInfo: {
          search: '',
          pageNum: 1,
          pageSize: 5,
        },
        editSummaryVisible: false,
        editSummaryForm: {
          id: '',
          source: '',
          description: ''
        },
        editSummaryFormRef: {
          source: [
            {
              min: 0,
              max: 20,
              message: '长度小于20',
              trigger: 'blur'
            }
          ],
          description: [
            {
              min: 0,
              max: 100,
              message: '长度小于100',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      async getSummaryList(){
        const res = await this.$http.get('feature/getsummarylist', {
          params: this.queryInfo
        }).catch(error => {
          if (error.response) {
            return this.$message.error(error.response.data);
          }
          else {
            return this.$message.error(error.message);
          }
        })
        if(res.status !== 200)
          return this.$message.error('get file summary list failed')
        this.summaryList = res.data.list
        this.total = res.data.total
      },
      handleSizeChange(newSize){
        this.queryInfo.pageSize = newSize
        this.getFileList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pageNum = newPage
        this.getFileList()
      },
      editSummary(id){
        this.$refs.editSummaryFormRef.validate(async valid => {
          if(!valid)
            return
          const res = await this.$http.put('admin/summarymanage', this.editSummaryForm).catch(error => {
            if (error.response) {
              this.$message.error(error.response.data);
            } else {
              this.$message.error(error.message);
            }
          })
          if(res.status !== 200)
            return this.$message.error("Edit Summary error")
          if(res.data.msg !== 'success')
            return this.$message.error(res.data.msg)
          this.getSummaryList()
          this.editSummaryVisible = false
          return this.$message.success('success')
        })
      },
      async deleteSummary(dataName){
        const confirmResult = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        if(confirmResult !== 'confirm'){
          this.$message.info('取消删除')
        }
        else{
          const res = await this.$http.delete('admin/summarymanage', {
            params: {
              'dataName': dataName
            }
          })
          if(res.status !== 200){
            return this.$message.error('Delete data failed')
          }
          if(res.data.msg !== 'success')
            return this.$message.error(res.data.msg)
          this.getSummaryList()
          return this.$message.success('delete success')
        }
      },
      editSummaryClose(){
        this.$refs.editSummaryFormRef.resetFields()
      },
      showEditSummaryDialog(index){
        const curSummary = this.summaryList[index]
        this.editSummaryForm.id = curSummary.pk
        this.editSummaryForm.source = curSummary.fields.source
        this.editSummaryForm.description = curSummary.fields.description
        this.editSummaryVisible = true
      },
      goToData(name){
        this.$router.push(`/data/${name}`)
      }
    }
  }
</script>

<style scoped>
  .el-card{
    margin-top: 10px;
  }
  .el-tag{
    font-weight: bold;
    width: 100px;
    text-align: center;
  }

</style>
