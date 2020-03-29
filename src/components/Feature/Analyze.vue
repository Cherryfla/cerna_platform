<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Feature</el-breadcrumb-item>
      <el-breadcrumb-item>Analyze</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
    <!--表单区域-->
      <el-form ref="analyzeFormRef" :model="analyzeForm" :rules="analyzeFormRules"
               label-width="300px" label-position="top" v-loading="formLoading"
               element-loading-text="Analyzing...">
        <el-form-item label="Cancer Type:" prop="cancerType">
          <el-select v-model="analyzeForm.cancerType" placeholder="Please choose cancer type">
            <el-option label="THCA" value="THCA"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="RNA Type:" prop="rnaType">
          <el-select v-model="analyzeForm.rnaType" placeholder="Please choose RNA type">
            <el-option label="miRNA" value="miRNA"></el-option>
            <el-option label="mRNA" value="mRNA"></el-option>
            <el-option label="lncRNA" value="lncRNA"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Data Source:" prop="dataSource">
          <el-select v-model="analyzeForm.dataSource" placeholder="Choose the data source">
            <el-option label="default" value="default"></el-option>
            <el-option :value="this.analyzeForm.dataSource">
              <el-upload action="http://121.41.85.40/api/feature/upload"
                         :limit="1" ref="formUpload" :multiple="false"
                         :on-success="handleUploadResponse" :on-error="handleUploadResponse"
                         :on-change="handleChange"
                         :show-file-list="false" :auto-upload="false">
                <em style="width: 100%;">select your file(Maximum Size: 10M)</em>
              </el-upload>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Analyze Code:" prop="analyzeCode">
          <el-select v-model="analyzeForm.analyzeCode" placeholder="Choose the analyze Code">
            <el-option label="default" value="default"></el-option>
          </el-select>
        </el-form-item>
        <div class="button-box">
          <el-button type="primary" @click="analyzeFormSubmit">Submit</el-button>
          <el-button type="danger" @click="resetForm">Reset</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Analyze',
    created () {
      this.resultVisible = false
      this.resultImgPath = ''
    },
    data(){
      return {
        formLoading: false,
        resultVisible: false,
        resultImgPath: '',
        analyzeForm: {
          cancerType: '',
          rnaType: '',
          dataSource: 'default',
          analyzeCode: 'default',
        },
        analyzeFormRules: {
          cancerType:[
            {
              required: true,
              message: 'Please choose cancer type',
              trigger: 'blur'
            }
          ],
          rnaType: [
            {
              required: true,
              message: 'Please choose RNA type',
              trigger: 'blur'
            }
          ],
          dataSource:[
            {
              required: true,
              message: 'Please choose cancer type',
              trigger: 'blur'
            }
          ],
          analyzeCode: [
            {
              required: true,
              message: 'Please choose RNA type',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      analyzeFormSubmit(){
        this.$refs.analyzeFormRef.validate(async valid => {
          if(!valid)
            return this.$message.error('Please fill in the necessary form items')
          this.formLoading = true
          const res = await this.$http.post('feature/analyze', this.analyzeForm).catch(error => {
            if (error.response) {
              // 请求已发出，但服务器响应的状态码不在 2xx 范围内
              this.$message.error(error.response.data);
            }
            else {
              this.$message.error(error.message);
            }
          });
          // console.log(res)
          this.formLoading = false
          if(res.status != 200)
            return this.$message.error('Analyze failed')
          await this.$router.push('/history')
        })
      },
      resetForm(){
        this.$refs.analyzeFormRef.resetFields()
      },
      handleUploadResponse(response, file, fileList){
        // console.log(response, file, fileList)
        if(file.status !== 'success')
          return this.$message.error("Upload file error")
        this.analyzeForm.dataSource = file.name
        return this.$message.success("Upload file success")
      },
      handleChange(file){
        if(file.status == 'ready'){
          //console.log(file)
          if(file.size >= 10*1024*1024){
            this.$message.error('file too large')
            this.$refs.formUpload.clearFiles()
          }
          this.$refs.formUpload.submit()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-card{
    margin-top: 10px;
    padding: 10px;
  }
  .el-select{
    width: 100%;
  }
  .el-form-item{
    width: 500px !important;
  }
  .el-button{
    width: 250px;
  }
  .button-box{
    margin-top: 40px ;
    text-align: center;
  }
  .resultImg{
    width: 100%;
  }

</style>
