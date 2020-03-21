<template>
    <div style="text-align: center">
      <el-upload ref="formUpload" drag
        action="http://121.41.85.40/api/admin/filesmanage"
        :headers="myHead"
        :multiple="false"
        :on-success="handleUploadResponse"
        :on-error="handleUploadResponse"
        :on-change="handleChange"
        :show-file-list="false"
        :auto-upload="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">文件大小不超过10M</div>
      </el-upload>
    </div>
</template>

<script>
  export default {
    name: 'AdminFiles',
    created () {

    },
    data () {
      return{

      }
    },
    methods: {
      handleUploadResponse(response, file, fileList){
        if(file.status !== 'success')
          return this.$message.error("Upload file error")
        return this.$message.success("Upload file success")
      },
      handleChange(file){
        if(file.status == 'ready'){
          //console.log(file)
          if(file.size >= 10*1024*1024){
            this.$message.error('file too large')
            this.$refs.formUpload.clearFiles()
          }
          // console.log('in handle change', file)
          this.$refs.formUpload.submit()
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

</style>
