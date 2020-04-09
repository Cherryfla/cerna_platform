<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Feature</el-breadcrumb-item>
      <el-breadcrumb-item>History</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--搜索区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="Please input file name" v-model="queryInfo.search"
                    clearable @clear="getHistoryList">
            <el-button slot="append" icon="el-icon-search" @click="getHistoryList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="historyList" border stripe>
        <el-table-column width="100px" label="Run id" prop="pk"></el-table-column>
        <el-table-column label="User" prop="fields.user"></el-table-column>
        <el-table-column width="300px" label="Submit time" prop="fields.datetime" :formatter="dateFormat"></el-table-column>
        <el-table-column width="150px" label="Operation" prop="fields.operation"></el-table-column>
        <el-table-column width="200px" label="Result" >
          <template slot-scope="scope">
            <el-tag type="success" v-if="isUrl(scope.row.fields.result)" style="cursor: pointer;"
               @click="showResult(scope.row.fields.result)">Completed</el-tag>
            <el-tag :type="getTagType(scope.row.fields.result)" v-else>{{scope.row.fields.result}}</el-tag>
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
      <!--结果显示区域-->
      <el-dialog title="Analyze Result" :visible.sync="resultVisible" width="500px">
        <img :src="resultUrl" alt="Result Image" class="resultImg">
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resultVisible = false">Confirm</el-button>
      </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import * as fecha from "element-ui/lib/utils/date";

  export default {
    name: 'History',
    created () {
      this.getHistoryList()
    },
    data () {
      return {
        historyList: [],
        //数据总数
        total: 0,
        queryInfo: {
          search: '',
          pageNum: 1,
          pageSize: 5
        },
        resultUrl: '',
        resultVisible: false
      }
    },
    methods: {
      async getHistoryList(){
        const res = await this.$http.get('feature/gethistorylist', {
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
          return this.$message.error('get file history failed')
        // console.log(res.data)
        this.historyList = res.data.list
        this.total = res.data.total
      },
      handleSizeChange(newSize){
        this.queryInfo.pageSize = newSize
        this.getHistoryList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pageNum = newPage
        this.getHistoryList()
      },
      dateFormat(row, column, cellValue) {
        return cellValue ? fecha.format(new Date(cellValue), 'yyyy-MM-dd HH:mm:ss') : '';
      },
      isUrl(value){
        const regUrl = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i
        return regUrl.test(value)
      },
      showResult(resultUrl){
        this.resultUrl = resultUrl
        this.resultVisible = true
      },
      getTagType(text){
        if(text == 'completed' || text == 'success')
          return 'success'
        else if(text == 'error')
          return 'danger'
        else
          return 'warning'
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
  .resultImg{
    width: 100%;
    height: auto;
  }
</style>
