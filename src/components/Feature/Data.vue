<template>
    <div>
      <!--面包屑导航区-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/summary'}">Summary</el-breadcrumb-item>
        <el-breadcrumb-item>Data</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="Please input key word" v-model="queryInfo.search"
                      clearable @clear="getData">
              <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-table :data="dataList" border stripe>
          <el-table-column v-for="(item, i) in columns" :key="i" :label="item"
                           sortable :prop="item">
          </el-table-column>
        </el-table>
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
    name: 'Data',
    created () {
      // console.log(this.$route.params.id)
      this.getData()
    },
    data(){
      return{
        queryInfo:{
          search: '',
          pageNum: 1,
          pageSize: 5
        },
        dataList: [],
        total: 0,
        columns: []
      }
    },
    methods:{
      async getData(){
        const res = await this.$http.get(`feature/getdata/${this.$route.params.id}`, {
          params: this.queryInfo
        }).catch(error => {
          if (error.response) {
            return this.$message.error(error.response.data);
          } else {
            return this.$message.error(error.message);
          }
        })
        if(res.status !== 200)
          return this.$message.error(`Get ${this.$route.params.id} data failed`)
        // console.log(res)
        this.total = res.data.total
        this.columns = res.data.columns
        this.dataList = res.data.list
      },
      handleSizeChange(newSize){
        this.queryInfo.pageSize = newSize
        this.getData()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pageNum = newPage
        this.getData()
      }
    }
  }
</script>

<style scoped>
  .el-card{
    margin-top: 10px;
  }
</style>
