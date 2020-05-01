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
      <el-row>
      <el-col :span="12">
      <el-form ref="analyzeFormRef" :model="analyzeForm" :rules="analyzeFormRules"
               label-width="300px" label-position="top" v-loading="formLoading"
               element-loading-text="Analyzing...">
        <el-form-item label="Analyze Type:" prop="analyzeType">
          <el-select v-model="analyzeForm.analyzeType">
            <el-option v-for="(item,i) in analyzeList" :key="i" :label="item.fields.name"
                       :value="item.fields.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="item in analyzeForm.options"
                      :label="analyzeList[analyzeIndex].optionName[item.key]"
                      :key="item.key"
                      :prop="'options.' + item.key + '.value'"
                      :rules="{
                        required: true,
                        message: 'domain is required',
                        trigger: 'blur'
                      }">
          <el-select v-model="item.value">
            <el-option v-for="(opt,i) in analyzeList[analyzeIndex].optionValue[item.key]" :key="i"
                       :value="opt" :label="opt"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Data Source:" prop="dataSource" >
          <el-select v-model="analyzeForm.dataSource" placeholder="Choose the data source"
                     :disabled="isCustomData">
            <el-option label="default" value="default"></el-option>
            <el-option :value="this.analyzeForm.dataSource">
              <el-upload :action="this.$http.defaults.baseURL + 'feature/upload'"
                         :limit="1" ref="formUpload" :multiple="false"
                         :on-success="handleUploadResponse" :on-error="handleUploadResponse"
                         :on-change="handleUploadChange"
                         :show-file-list="false" :auto-upload="false">
                <em style="width: 100%;">select your file(Maximum Size: 10M)</em>
              </el-upload>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Analyze Code:" prop="analyzeCode">
          <el-select :disabled="isCustomCode" v-model="analyzeForm.analyzeCode"
                     placeholder="Choose the analyze Code">
            <el-option label="default" value="default"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Description:">
          {{analyzeForm.description}}
        </el-form-item>
      </el-form>
      </el-col>
      </el-row>
      <div class="button-box">
        <el-button type="primary" @click="analyzeFormSubmit">Submit</el-button>
        <el-button type="danger" @click="resetForm">Reset</el-button>
      </div>
    </el-card>
    <el-backtop><i class="el-icon-caret-top"></i></el-backtop>
  </div>
</template>

<script>
  export default {
    name: 'Analyze',
    created () {
      this.getAnalyzeList()
    },
    data(){
      return {
        analyzeList: [],
        formLoading: false,
        resultVisible: false,
        resultImgPath: '',
        analyzeForm: {
          analyzeType: "",
          options: [],
          dataSource: 'default',
          analyzeCode: 'default',
          description: ''
        },
        analyzeFormRules: {
          analyzeType: [
            {
              required: true,
              message: 'Please choose analyze type',
              trigger: 'blur'
            }
          ],
          dataSource:[
            {
              required: true,
              message: 'Please choose your data',
              trigger: 'blur'
            }
          ],
          analyzeCode: [
            {
              required: true,
              message: 'Please choose your code',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      async getAnalyzeList(){
        const res = await this.$http.get('feature/analyze').catch(error => {
          if (error.response) {
            this.$message.error(error.response.data);
          } else {
            this.$message.error(error.message);
          }
        })
        if(res.status !== 200)
          return this.$message.error('Get analyze list error')
        if(res.data.msg != 'success')
          return this.$message.error(res.data.msg)
        //将options转化为对象
        // console.log(res.data)
        res.data.list.forEach(item => {
          if(!item.fields.options) {
            item.optionValue = []
            item.optionName = []
            return
          }
          let options = item.fields.options.split(';')
          let optionName = []
          let optionValue = []
          for(let i=0;i<options.length;i++){
            let temp = options[i].split(':')
            optionName.push(temp[0])
            optionValue.push(temp[1].split(','))
          }
          item.optionName = optionName
          item.optionValue = optionValue
        })
        this.analyzeList = res.data.list
        // console.log(this.analyzeList)
      },
      analyzeFormSubmit(){
        this.$refs.analyzeFormRef.validate(async (valid, object) => {
          if(!valid)
            return this.$message.error('Please finish the necessary domains')
          this.formLoading = true
          let optionStr = ''
          for(let i=0; i<this.analyzeForm.options.length;i++){
            if(i != 0)
              optionStr+='_'
            optionStr += this.analyzeForm.options[i].value
          }
          console.log(this.analyzeForm.dataSource)
          const res = await this.$http.post('feature/analyze', {
            id: this.analyzeList[this.analyzeIndex].pk,
            type: this.analyzeForm.analyzeType,
            options: optionStr,
            dataSource: this.analyzeForm.dataSource,
            analyzeCode: this.analyzeForm.analyzeCode,
          }).catch(error => {
            if (error.response) {
              this.$message.error(error.response.data);
            }
            else {
              this.$message.error(error.message);
            }
          });
          // console.log(res)
          this.formLoading = false
          if(res.status !== 200)
            return this.$message.error('Analyze failed')
          if(res.data.msg != 'success')
            return this.$message.error(res.data.msg)
          await this.$router.push('/history')
        })
      },
      resetForm(){
        this.analyzeForm.analyzeType = ""
        this.analyzeForm.options = []
        this.analyzeForm.description = ""
        // this.$refs.analyzeFormRef.resetFields()
        this.$refs.analyzeFormRef.clearValidate()
      },
      handleUploadResponse(response, file, fileList){
        // console.log(response, file, fileList)
        if(file.status !== 'success')
          return this.$message.error("Upload file error")
        this.analyzeForm.dataSource = file.name
        return this.$message.success("Upload file success")
      },
      handleUploadChange(file){
        if(file.status == 'ready'){
          //console.log(file)
          if(file.size >= 10*1024*1024){
            this.$message.error('file too large')
            this.$refs.formUpload.clearFiles()
          }
          this.$refs.formUpload.submit()
        }
      },
    },
    computed: {
      analyzeIndex: function(){
        return this.analyzeList.findIndex(item => {
          return item.fields.name === this.analyzeForm.analyzeType
        })
      },
      isCustomData:  function(){
        let index = this.analyzeIndex
        if(index == -1)
          return true
        return !this.analyzeList[index].fields.customData
      },
      isCustomCode: function(){
        let index = this.analyzeIndex
        if(index == -1)
          return true
        return !this.analyzeList[index].fields.customCode
      }
    },
    watch: {
      analyzeIndex(value, oldValue){
        if(value == -1)
          return
        this.analyzeForm.options = []
        for(let i=0;i<this.analyzeList[this.analyzeIndex].optionName.length;i++) {
          this.analyzeForm.options.push({
            value: '',
            key: i
          })
        }
        this.analyzeForm.description = this.analyzeList[this.analyzeIndex].fields.description
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
  /*.el-form-item{*/
  /*  width: 500px !important;*/
  /*}*/
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
