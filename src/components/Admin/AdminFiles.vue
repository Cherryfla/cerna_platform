<template>
  <el-tabs v-model="activeName" tab-position="left">
    <el-tab-pane label="Download" name="0">
      <div style="text-align: center">
        <el-upload ref="formUpload" drag
        :action="uploadAction"
        :headers="myHead"
        :multiple="false"
        :on-success="handleUploadResponse"
        :on-error="handleUploadResponse"
        :on-change="handleChange"
        :before-remove="beforeRemove"
        :on-remove="handleRemove"
        :auto-upload="false"
        :show-file-list="true">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">文件大小不超过20M; 文件不得重名</div>
        </el-upload>
      </div>
    </el-tab-pane>
    <el-tab-pane label="Summary" name="1">
      <div style="text-align: center">
        <el-upload ref="summaryUpload" drag
         v-loading="summaryLoading"
         element-loading-text="文件处理中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.5)"
         :action="summaryAction"
         :headers="myHead"
         :multiple="false"
         :limit="1"
         :on-success="handleUploadResponse"
         :on-error="handleUploadResponse"
         :on-change="handleSummaryChange"
         :before-remove="(file, fileList) => false"
         :auto-upload="false"
         :show-file-list="true">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">文件大小不超过20M;只支持UTF-8编码的csv文件;文件不得重名</div>
        </el-upload>
      </div>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
  export default {
    name: 'AdminFiles',
    created () {

    },
    data () {
      return{
        activeName: 0,
        uploadAction: "http://121.41.85.40/api/admin/filesmanage",
        summaryAction: "http://121.41.85.40/api/admin/summarymanage",
        summaryLoading: false
      }
    },
    methods: {
      handleUploadResponse(response, file, fileList){
        this.summaryLoading = false
        if(file.status !== 'success')
          return this.$message.error(""+response)
        if(response.msg !== 'success')
          return this.$message.error(response.msg)
        return this.$message.success("Upload file success")
      },
      handleChange(file){
        if(file.status == 'ready'){
          //console.log(file)
          if(file.size >= 20*1024*1024){
            this.$message.error('file too large')
            this.$refs.formUpload.clearFiles()
          }
          // console.log('in handle change', file)
          this.$refs.formUpload.submit()
        }
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      async handleRemove(file,fileList){
        const res = await this.$http.delete('admin/filesmanage', {
          params: {
            'fileName': file.name
          }
        })
        if(res.status !== 200){
          return this.$message.error('Delete file failed')
        }
        if (res.data.msg !== 'success')
          return this.$message.error(res.data.msg)
      },
      handleSummaryChange(file, fileList){
        if(file.status == 'ready'){
          //console.log(file)
          if(file.size >= 20*1024*1024){
            this.$message.error('file too large')
            this.$refs.summaryUpload.clearFiles()
          }
          // console.log('in handle change', file)
          this.summaryLoading = true
          this.$refs.summaryUpload.submit()
        }
      }
    },
    computed: {
      myHead(){
        const token =  window.sessionStorage.getItem('token')
        return {
          'authorization': token
        }
      }
    }
  }
</script>

<style scoped>
.el-tabs{
  margin-top: 30px;
}
</style>
