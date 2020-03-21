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
          <el-input placeholder="Please input file name" v-model="queryInfo.search"
                    clearable @clear="getSummaryList">
            <el-button slot="append" icon="el-icon-search" @click="getSummaryList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="summaryList" border stripe>
        <el-table-column width="100px" label="Run id" prop="pk"></el-table-column>
        <el-table-column label="Data" prop="fields.name"></el-table-column>
        <el-table-column label="Uploader" prop="fields.author"></el-table-column>
        <el-table-column width="300px" label="Post time" prop="fields.date"></el-table-column>
        <el-table-column width="150px" label="Operation" prop="fields.operation"></el-table-column>
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
  </div>
</template>

<script>
  export default {
    name: 'Summary',
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
          pageSize: 5
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
