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
      <el-table :data="summaryList" :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}" stripe>
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
              <el-form-item label="Tags">
                <el-tag class="dataTags" v-for="(item,i) in scope.row.fields.tags " :key="i"
                        :closable="isAdmin"  @close="handleTagClose(i, scope.row)">
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-model="scope.row.inputValue"
                  v-if="isAdmin & scope.row.inputVisible"
                  ref="showTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else-if="isAdmin & !scope.row.inputVisible"
                           size="small" @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="Data">
          <template slot-scope="scope" >
            <el-tag class="dataName" type="info" style="cursor:pointer" @click="goToData(scope.row.fields.name)">
              {{scope.row.fields.name}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Uploader" prop="fields.author"></el-table-column>
        <el-table-column label="Source" prop="fields.source"></el-table-column>
        <el-table-column width="300px" label="Post time" prop="fields.date"></el-table-column>
        <el-table-column width="250px" label="Operation" v-if="isAdmin">
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
      <el-form :model="editSummaryForm" ref="editSummaryFormRef" :rules="editSummaryFormRules">
        <el-form-item label="Source:" prop="source">
          <el-input v-model="editSummaryForm.source"></el-input>
        </el-form-item>
        <el-form-item label="Description:" prop="description">
          <el-input type="textarea" v-model="editSummaryForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSummaryVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editSummary">Confirm</el-button>
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
        xxx: '',
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
        editSummaryFormRules: {
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
        },
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
        res.data.list.forEach(item => {
            item.fields.tags = item.fields.tags? item.fields.tags.split(',') : []
            item.inputVisible = false
            item.inputValue = ''
        })
        this.summaryList = res.data.list
        this.total = res.data.total
      },
      handleSizeChange(newSize){
        this.queryInfo.pageSize = newSize
        this.getSummaryList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pageNum = newPage
        this.getSummaryList()
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
      },
      //处理tag关闭事件
      handleTagClose(i, row){
        row.fields.tags.splice(i, 1)
        this.saveTags(row)
      },
      //修改数据的tag属性
      async saveTags(row){
        const res = await this.$http.put(`admin/tagsmanage/${row.pk}`,{
          tags: row.fields.tags.join(','),
          type: 0
        })
        if(res.status !== 200){
          return this.$message.error('failed')
        }
        return this.$message.success('success')
      },
      //文本框失去焦点，或是按下enter键都会触发
      async handleInputConfirm(row){
        if(row.inputValue.trim().length === 0){
          row.inputVisible = false
          row.inputValue = ''
          return
        }
        row.fields.tags.push(row.inputValue.trim())
        row.inputVisible = false
        row.inputValue = ''
        this.saveTags(row)
      },
      showInput(row) {
        row.inputVisible = true
        this.$nextTick(() => {
          this.$refs.showTagInput.$refs.input.focus();
        })
      },
    },
    computed: {
      isAdmin(){
        return this.power < 5
      }
    }
  }
</script>

<style scoped>
  .el-card{
    margin-top: 10px;
  }
  .dataName{
    font-weight: bold;
    text-align: center;
  }
</style>
