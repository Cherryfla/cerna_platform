<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Feature</el-breadcrumb-item>
      <el-breadcrumb-item>Download</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--搜索区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="Please input file name" v-model="queryInfo.search"
                    clearable @clear="getFileList">
            <el-button slot="append" icon="el-icon-search" @click="getFileList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--文件列表区域-->
      <el-table :data="fileList" border stripe>
        <el-table-column fixed width="300px" label="File Name" prop="fields.file_name"></el-table-column>
        <el-table-column width="150px" label="File Size(MB)" prop="fields.file_size"></el-table-column>
        <el-table-column width="150px" label="Author" prop="fields.file_author"></el-table-column>
        <el-table-column width="200px" label="Date" prop="fields.file_date"></el-table-column>
        <el-table-column width="100px" label="Show" v-if="isAdmin">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.fields.show" @change="handleShowChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column width="150px" label="Operation">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-download" size="mini"
                       @click="downloadFile(scope.row.fields.file_name)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="deleteFile(scope.row.fields.file_name)" v-if="isAdmin"></el-button>
          </template>
        </el-table-column>
        <el-table-column width="400px" label="Tags">
          <template slot-scope="scope">
            <el-tag class="dataTags" v-for="(item, i) in scope.row.fields.tags" :key="i" :closable="isAdmin"
                    @close="handleTagClose(i, scope.row)">
              {{item}}
            </el-tag>
            <el-input
              class="input-new-tag" v-model="scope.row.inputValue"
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
          </template>
        </el-table-column>
      </el-table>
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
    </el-card>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'download',
    props: ['power'],
    watch: {
      power: function (val) {}
    },
    created () {
      this.getFileList()
      // console.log(this.power)
    },
    methods: {
      async getFileList(){
        const res = await this.$http.get('feature/download/getfilelist', {
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
          return this.$message.error('get file list failed')
        if(!this.isAdmin)
          res.data.list = res.data.list.filter(item => item.fields.show)
        res.data.list.forEach(item => {
          item.fields.tags = item.fields.tags? item.fields.tags.split(',') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        this.fileList = res.data.list
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
      async downloadFile (fileName) {
        let fileUrl = 'http://121.41.85.40/data/' + fileName
        let a = document.createElement('a');
        a.href = fileUrl;
        a.click();
      },
      async deleteFile(fileName){
        const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        if(confirmResult !== 'confirm'){
          this.$message.info('取消删除')
        }
        else{
          const res = await this.$http.delete('admin/filesmanage', {
            params: {
              'fileName': fileName
            }
          })
          if(res.status !== 200){
            return this.$message.error('Delete file failed')
          }
          if (res.data.msg !== 'success')
            return this.$message.error(res.data.msg)
          this.getFileList()
          return this.$message.success('delete success')
        }
      },
      handleTagClose(i, row){
        row.fields.tags.splice(i, 1)
        this.saveTags(row)
      },//修改数据的tag属性
      async saveTags(row){
        const res = await this.$http.put(`admin/tagsmanage/${row.pk}`,{
          tags: row.fields.tags.join(','),
          type: 1
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
      async handleShowChange(file){
        const res = await this.$http.put('admin/filesmanage', {
          id: file.pk,
          show: file.fields.show
        }).catch(error => {
          if (error.response) {
            return this.$message.error(error.response.data);
          } else {
            return this.$message.error(error.message);
          }
        })
        if(res.status !== 200)
          return this.$message.error('Update File Info Error')
        if(res.data.msg != 'success')
          return this.$message.error(this.data.msg)
        this.$message.success('success')
      }
    },
    data() {
      return {
        queryInfo:{
          search: '',
          pageNum: 1,
          pageSize: 5
        },
        fileList: [],
        total: 0,
        // downLoadPower: 5
      }
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
  .uploadButton{
    margin-top: 10px ;
    text-align: center !important;
    display: inline;
  }
</style>
